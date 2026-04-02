"use client";

import { lazy, Suspense } from "react";

const AcademyBackground = lazy(() => import("@/components/academy/AcademyBackground"));

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* 3D 빌리버 테마 배경 — 모든 academy 페이지에 적용 */}
      <Suspense fallback={null}>
        <AcademyBackground />
      </Suspense>

      {/* 도트 그리드 오버레이 */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      {/* 페이지 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
