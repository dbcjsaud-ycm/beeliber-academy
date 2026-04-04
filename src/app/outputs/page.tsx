import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OutputsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">결과물 저장 / 버전관리 구조</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Academy의 워크스페이스 결과물은 document와 version 2단 구조로 저장합니다.
          초안과 수정본이 덮어씌워지지 않고, 과거 버전을 다시 불러와 복원할 수 있게 설계합니다.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>workspace_documents</CardTitle>
            <CardDescription>사용자별 결과물 묶음</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• user_id</p>
            <p>• track_slug / lesson_slug</p>
            <p>• title / status</p>
            <p>• current_version_no / current_version_id</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>workspace_document_versions</CardTitle>
            <CardDescription>문서 내부의 저장 시점 이력</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• version_no</p>
            <p>• prompt_text</p>
            <p>• input_payload</p>
            <p>• output_payload</p>
            <p>• ai_provider / ai_model / notes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
