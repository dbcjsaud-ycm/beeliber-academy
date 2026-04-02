import Link from "next/link";
import { notFound } from "next/navigation";
import { getModulesByTrack, getAssignmentsByModule, getTrackBySlug } from "@/lib/academy/data";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_DOT: Record<string, string> = {
  basic: "bg-green-500", intermediate: "bg-yellow-500", advanced: "bg-red-500",
};
const DIFFICULTY_LABEL: Record<string, string> = {
  basic: "기초", intermediate: "중급", advanced: "고급",
};

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrackBySlug(slug);
  if (!track) return notFound();

  const modules = getModulesByTrack(track.id);

  return (
    <div className="min-h-screen academy-bg text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-secondary-dark hover:text-white">홈</Link>
          <span className="text-white/20">/</span>
          <Link href="/academy" className="text-secondary-dark hover:text-white">트랙</Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">{track.title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-panel p-8 mb-8">
          <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">트랙 #{track.order_no}</Badge>
          <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
          <p className="text-secondary-dark mb-4">{track.description}</p>
          <div className="flex gap-4 text-sm text-secondary-dark">
            <span>{modules.length}개 모듈</span>
            <span>총 {modules.reduce((s, m) => s + m.estimated_minutes, 0)}분</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">실습 모듈</h2>
        <div className="space-y-4">
          {modules.map((module, idx) => {
            const assignments = getAssignmentsByModule(module.id);
            return (
              <div key={module.id} className="node-card p-6">
                <div className="flex items-start gap-4">
                  <Link href={`/academy/modules/${module.slug}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center font-bold shrink-0 hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer">
                      {idx + 1}
                    </div>
                  </Link>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/academy/modules/${module.slug}`} className="hover:text-blue-400 transition-colors">
                        <h3 className="font-bold">{module.title}</h3>
                      </Link>
                      <span className={`w-2 h-2 rounded-full ${DIFFICULTY_DOT[module.difficulty]}`} />
                      <span className="text-xs text-secondary-dark">{DIFFICULTY_LABEL[module.difficulty]} · {module.estimated_minutes}분</span>
                    </div>
                    <p className="text-sm text-secondary-dark mb-3">{module.summary}</p>

                    {assignments.length > 0 && (
                      <div className="glass-panel-light rounded-lg p-3">
                        <p className="text-xs font-semibold text-secondary-dark mb-2">실습 과제</p>
                        {assignments.map((a) => (
                          <Link key={a.id} href={`/academy/assignments/${a.id}`}>
                            <div className="flex items-center justify-between py-1.5 hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="status-dot status-dot-active" />
                                <span className="text-sm">{a.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-white/5 text-secondary-dark border-white/10 text-xs">{a.submission_type}</Badge>
                                {a.due_days && <span className="text-xs text-red-400">D-{a.due_days}</span>}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
