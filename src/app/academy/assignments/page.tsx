"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ASSIGNMENTS, MODULES, TRACKS } from "@/lib/academy/data";
import { Badge } from "@/components/ui/badge";

const TYPE_ICON: Record<string, string> = {
  text: "📝", markdown: "📄", json: "💾", image: "🎨", video: "🎬", mixed: "📦",
};

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen academy-bg text-white">
      <header className="glass-panel-light sticky top-0 z-50 mx-4 mt-3 rounded-xl">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/academy" className="text-secondary-dark hover:text-white">대시보드</Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">과제 센터</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-2">과제 센터</h2>
          <p className="text-secondary-dark mb-8 text-sm">모든 실습 과제를 한눈에 확인하고 제출하세요. AI가 자동 검수합니다.</p>
        </motion.div>

        <div className="space-y-3">
          {ASSIGNMENTS.map((a, i) => {
            const module = MODULES.find((m) => m.id === a.module_id);
            const track = module ? TRACKS.find((t) => t.id === module.track_id) : null;

            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/academy/assignments/${a.id}`}>
                  <div className="node-card p-5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 glass-panel-light rounded-lg flex items-center justify-center text-lg">
                          {TYPE_ICON[a.submission_type] || "📝"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{a.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {track && <span className="text-[10px] text-secondary-dark">{track.title}</span>}
                            <Badge className="bg-white/5 text-secondary-dark border-white/10 text-[10px]">{a.submission_type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {a.due_days && <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">D-{a.due_days}</Badge>}
                        <Badge className="bg-white/5 text-white/30 border-white/10 text-xs">미제출</Badge>
                        <span className="text-white/20">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
