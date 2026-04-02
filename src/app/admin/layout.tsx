"use client";

import { lazy, Suspense } from "react";

const AcademyBackground = lazy(() => import("@/components/academy/AcademyBackground"));

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Suspense fallback={null}>
        <AcademyBackground />
      </Suspense>
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
