import Link from 'next/link';

export default function TracksPage() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">실전 세션</h1>
      <p className="mt-3 text-slate-600">이 목업에서는 /workspace 를 메인 진입점으로 사용합니다.</p>
      <Link href="/workspace" className="mt-4 inline-flex rounded-xl border px-4 py-2 text-sm">워크스페이스로 이동</Link>
    </div>
  );
}
