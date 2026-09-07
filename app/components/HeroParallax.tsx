"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Depth-parallax hero via a DISPLACED MESH (not UV-offset).
// A finely subdivided plane is textured with the photo; each vertex is pushed
// in Z by its depth, and a perspective camera pans slightly. Near geometry
// physically occludes far via the z-buffer, so there is no translucent "ghost"
// at silhouettes - the old single-sample artifact is gone. Isolated client leaf.
// Honors reduced motion; keeps an <img> poster for instant paint / WebGL fallback.

const VERT = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDisp;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;      // 1 = near, 0 = far
    vec3 p = position;
    p.z += (d - 0.5) * uDisp;               // near toward camera, far away
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uImage, vUv);
  }
`;

const FOV = 34; // narrower lens = flatter, less edge warp (keeps the photo clean)
const CAM_Z = 3;
const SEG_X = 300; // denser mesh = smoother silhouettes under the bigger motion
const SEG_Y = 225;
const OVERSCAN = 1.24; // extra margin so the larger pan never reveals an edge
const DISP = 0.62; // depth relief - bold pop, still short of rubber-stretch
const PAN = 0.24; // camera drift - the main "drama" dial, cranked up

export function HeroParallax({
  image,
  depth,
  alt,
  className = "",
}: {
  image: string;
  depth: string;
  alt: string;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch {
      return; // no WebGL -> poster img stays visible
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x14110d, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    // neutral depth until the real map loads (no displacement)
    const flat = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
    flat.needsUpdate = true;

    const uniforms = {
      uImage: { value: null as THREE.Texture | null },
      uDepth: { value: flat as THREE.Texture },
      uDisp: { value: reduce ? DISP : 0 }, // ramp in after load (static if reduced)
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
    const geo = new THREE.PlaneGeometry(1, 1, SEG_X, SEG_Y);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let imageAspect = 1;

    const fit = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const viewAspect = w / h;
      renderer.setSize(w, h, false);
      camera.aspect = viewAspect;
      camera.updateProjectionMatrix();

      // frustum size at the plane, then cover-fit the image aspect over it
      const hf = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
      const wf = hf * viewAspect;
      let planeW: number, planeH: number;
      if (viewAspect > imageAspect) {
        planeW = wf;
        planeH = planeW / imageAspect;
      } else {
        planeH = hf;
        planeW = planeH * imageAspect;
      }
      mesh.scale.set(planeW * OVERSCAN, planeH * OVERSCAN, 1);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(mount);

    const loader = new THREE.TextureLoader();
    let depthLoaded = false;
    loader.load(image, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      uniforms.uImage.value = t;
      imageAspect = t.image.width / t.image.height;
      fit();
      canvas.style.opacity = "1";
    });
    loader.load(depth, (t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      uniforms.uDepth.value = t;
      depthLoaded = true;
    });

    fit();

    const target = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      // ease the relief in once the depth map is ready
      if (!reduce && depthLoaded && uniforms.uDisp.value < DISP) {
        uniforms.uDisp.value = Math.min(DISP, uniforms.uDisp.value + DISP * 0.02);
      }
      if (!reduce) {
        const t = (now - start) / 1000;
        const idleX = Math.sin(t * 0.22) * 0.4;
        const idleY = Math.cos(t * 0.17) * 0.28;
        const tx = (target.x + idleX) * PAN;
        const ty = -(target.y + idleY) * PAN;
        camera.position.x += (tx - camera.position.x) * 0.04;
        camera.position.y += (ty - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
      }
      if (uniforms.uImage.value) renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      flat.dispose();
      uniforms.uImage.value?.dispose();
      uniforms.uDepth.value?.dispose();
      renderer.dispose();
    };
  }, [image, depth]);

  return (
    <div ref={mountRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* poster: instant paint + fallback if WebGL fails */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
      />
    </div>
  );
}
