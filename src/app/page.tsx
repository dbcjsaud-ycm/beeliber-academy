import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-blue-600">Academy</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            설명형 수업이 아니라, AI 실행과 저장이 되는 워크스페이스형 교육 구조
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            마케팅, 이미지 투 비디오, 웹/앱 개발, 자동화 트랙을 실제 프롬프트 입력창과 결과 패널로 학습하고
            결과물은 Supabase에 버전 단위로 저장합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/workspace">워크스페이스 열기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/lab/marketing/campaign-copy-studio">샘플 수업 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['마케팅', '광고 문구, 채널별 카피, 랜딩 초안'],
          ['이미지 투 비디오', '컷 구성, 장면 프롬프트, 자막'],
          ['웹/앱 개발', '화면 구조, 기능 목록, 작업지시서'],
          ['자동화', '입력-처리-결과, 역할 분리, 검수 흐름'],
        ].map(([title, desc]) => (
          <Card key={title} className="rounded-2xl">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/workspace">트랙 보기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
