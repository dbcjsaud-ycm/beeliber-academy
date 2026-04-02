import Link from "next/link";
import { ASSIGNMENTS, MODULES, TRACKS } from "@/lib/academy/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-neutral-400 hover:text-black">홈</Link>
          <span className="text-neutral-300">/</span>
          <span className="font-semibold">과제 센터</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">과제 센터</h2>
        <p className="text-neutral-500 mb-8">모든 실습 과제를 한눈에 확인하고 제출하세요.</p>

        <div className="space-y-3">
          {ASSIGNMENTS.map((a) => {
            const module = MODULES.find((m) => m.id === a.module_id);
            const track = module ? TRACKS.find((t) => t.id === module.track_id) : null;

            return (
              <Link key={a.id} href={`/academy/assignments/${a.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">
                          {a.id.replace('a', '#')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{a.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {track && <span className="text-xs text-neutral-400">{track.title}</span>}
                            <Badge variant="outline" className="text-xs">{a.submission_type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.due_days && <Badge className="bg-red-100 text-red-700">D-{a.due_days}</Badge>}
                        <Badge variant="outline" className="text-xs text-neutral-400">미제출</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
