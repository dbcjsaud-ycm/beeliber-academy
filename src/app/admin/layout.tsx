export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen academy-bg">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
