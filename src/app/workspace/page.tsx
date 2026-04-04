import Link from 'next/link';
import { academyTracks } from '@/lib/academy-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="max-w-4xl space-y-4">
          <Badge>Workspace Page</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            실행하고, 저장하고, 버전으로 비교하는 실습형 AI 워크스페이스
          </h1>
          <p className="text-slate-600 md:text-lg">
            각 트랙은 설명 카드만 있는 페이지가 아니라, 실제 프롬프트를 넣고 결과를 생성하고
            Supabase에 저장하며 버전 복원까지 하는 수업으로 구성합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/lab/marketing/campaign-copy-studio">샘플 수업 바로 열기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/outputs">저장 구조 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {academyTracks.map((track) => (
          <Card key={track.slug} className="rounded-3xl border bg-white shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{track.label}</Badge>
                <Badge variant="outline">{track.lessons.length} lessons</Badge>
              </div>
              <CardTitle className="text-2xl">{track.workspaceTitle}</CardTitle>
              <CardDescription className="text-base">{track.workspaceSummary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">이 워크스페이스에서 직접 하는 것</p>
                <div className="flex flex-wrap gap-2">
                  {track.outcomes.map((outcome) => (
                    <Badge key={outcome} variant="outline">{outcome}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">수업 구조</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• 교수 가이드 확인</li>
                  <li>• 프롬프트 직접 입력</li>
                  <li>• AI 결과 생성</li>
                  <li>• 구조 인스펙터로 검수</li>
                  <li>• Supabase에 버전 저장</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">대표 수업</p>
                <div className="grid gap-2">
                  {track.lessons.slice(0, 2).map((lesson) => (
                    <Link
                      key={lesson.slug}
                      href={`/lab/${track.slug}/${lesson.slug}`}
                      className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm transition hover:bg-slate-100"
                    >
                      <span className="font-semibold text-slate-900">{lesson.title}</span>
                      <span className="mt-1 block text-slate-600">{lesson.summary}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full rounded-xl">
                <Link href={`/lab/${track.slug}/${track.lessons[0].slug}`}>첫 실습 열기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
