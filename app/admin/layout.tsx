import type { Metadata } from "next";
import { AdminTopbar } from "./AdminTopbar";

export const metadata: Metadata = {
  title: "Studio Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-ivory text-onyx">
      <AdminTopbar />
      <div className="mx-auto max-w-[1200px] px-6 py-8">{children}</div>
    </div>
  );
}
