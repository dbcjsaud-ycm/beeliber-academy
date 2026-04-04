'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, RotateCcw, Save, Sparkles } from 'lucide-react';
import type { AcademyLesson, AcademyTrack } from '@/lib/academy-data';
import type { WorkspaceDocument, WorkspaceDocumentVersion } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type StructuredResult = {
  title: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
};

export function LessonWorkspace({ track, lesson }: { track: AcademyTrack; lesson: AcademyLesson }) {
  const [prompt, setPrompt] = useState(lesson.defaultPrompt);
  const [fields, setFields] = useState<Record<string, string>>(
    Object.fromEntries(lesson.inputFields.map((field) => [field.label, field.placeholder])),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<StructuredResult>({
    title: lesson.mockResult.headline,
    summary: lesson.summary,
    sections: lesson.mockResult.sections,
  });
  const [rawText, setRawText] = useState(lesson.mockResult.sections.map((item) => `## ${item.title}\n${item.body}`).join('\n\n'));
  const [documentState, setDocumentState] = useState<WorkspaceDocument | null>(null);
  const [versions, setVersions] = useState<WorkspaceDocumentVersion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const quickActions = useMemo(() => lesson.quickActions, [lesson.quickActions]);

  async function handleRun() {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackSlug: track.slug,
          lessonSlug: lesson.slug,
          prompt,
          inputPayload: fields,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || 'AI_GENERATION_FAILED');
      }

      setRawText(json.rawText);
      setResult(json.structured);
    } catch (err) {
      console.error(err);
      setError('AI 실행 중 오류가 발생했습니다. 환경변수나 API 키를 확인해주세요.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    const payload = {
      title: result.title || lesson.title,
      promptText: prompt,
      inputPayload: fields,
      outputPayload: {
        rawText,
        structured: result,
      },
      aiProvider: 'openai',
      aiModel: 'server-env',
      trackSlug: track.slug,
      lessonSlug: lesson.slug,
      notes: documentState ? `Saved from workspace version ${documentState.current_version_no + 1}` : 'Initial save',
    };

    try {
      const response = await fetch(
        documentState ? `/api/workspace/${documentState.id}/versions` : '/api/workspace',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            documentState
              ? {
                  promptText: payload.promptText,
                  inputPayload: payload.inputPayload,
                  outputPayload: payload.outputPayload,
                  aiProvider: payload.aiProvider,
                  aiModel: payload.aiModel,
                  notes: payload.notes,
                }
              : payload,
          ),
        },
      );

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || 'SAVE_FAILED');
      }

      setDocumentState(json.document);
      const nextVersion = json.version as WorkspaceDocumentVersion;
      setVersions((prev) => [nextVersion, ...prev]);
    } catch (err) {
      console.error(err);
      setError('저장에 실패했습니다. 로그인 세션과 Supabase 정책을 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  }

  async function loadVersions() {
    if (!documentState) return;

    try {
      const response = await fetch(`/api/workspace/${documentState.id}/versions`);
      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || 'FAILED_TO_LOAD_VERSIONS');
      }

      setVersions(json.versions ?? []);
    } catch (err) {
      console.error(err);
      setError('버전 목록을 불러오지 못했습니다.');
    }
  }

  async function handleRestore(versionId: string) {
    if (!documentState) return;

    try {
      const response = await fetch(`/api/workspace/${documentState.id}/versions/${versionId}/restore`, {
        method: 'POST',
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error || 'FAILED_TO_RESTORE_VERSION');
      }

      const restored = json.version as WorkspaceDocumentVersion;
      const outputPayload = restored.output_payload as {
        rawText?: string;
        structured?: StructuredResult;
      };

      if (outputPayload.rawText) setRawText(outputPayload.rawText);
      if (outputPayload.structured) setResult(outputPayload.structured);

      setDocumentState(json.document);
      await loadVersions();
    } catch (err) {
      console.error(err);
      setError('버전 복원에 실패했습니다.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{track.label}</Badge>
              <Badge variant="outline">{lesson.level}</Badge>
              {documentState ? <Badge variant="outline">v{documentState.current_version_no}</Badge> : null}
            </div>
            <div>
              <p className="text-sm text-slate-500">/lab/{track.slug}/{lesson.slug}</p>
              <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
              <p className="mt-2 max-w-3xl text-slate-600">{lesson.summary}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link href="/workspace">워크스페이스로</Link></Button>
            <Button variant="outline" onClick={loadVersions} disabled={!documentState}>버전 새로고침</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {documentState ? '새 버전 저장' : '첫 저장'}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>교수 가이드</CardTitle>
              <CardDescription>오늘 수업에서 집중할 핵심</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold">오늘의 결과물</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  {lesson.outcomes.map((outcome) => <li key={outcome}>• {outcome}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-semibold">실수 방지 포인트</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  {lesson.risks.map((risk) => <li key={risk}>• {risk}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-semibold">교수 메모</p>
                <p className="mt-2 text-slate-600">{lesson.professorNote}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>추천 프롬프트 칩</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setPrompt((prev) => `${prev}\n${action}`.trim())}
                  className="rounded-full border px-3 py-1.5 text-left text-xs text-slate-700 transition hover:bg-slate-50"
                >
                  {action}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>버전 이력</CardTitle>
              <CardDescription>저장 후 과거 결과를 다시 확인하고 복원할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!documentState ? (
                <p className="text-sm text-slate-500">아직 저장된 버전이 없습니다.</p>
              ) : versions.length === 0 ? (
                <p className="text-sm text-slate-500">버전을 불러오려면 새로고침을 눌러주세요.</p>
              ) : (
                versions.map((version) => (
                  <div key={version.id} className="rounded-2xl border bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Version {version.version_no}</p>
                        <p className="text-xs text-slate-500">{new Date(version.created_at).toLocaleString('ko-KR')}</p>
                      </div>
                      <Button variant="outline" className="h-8 px-3 text-xs" onClick={() => handleRestore(version.id)}>
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        복원
                      </Button>
                    </div>
                    {version.notes ? <p className="mt-2 text-xs text-slate-600">{version.notes}</p> : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>프롬프트 스튜디오</CardTitle>
              <CardDescription>실제 프롬프트를 직접 넣고 AI를 실행한 뒤 저장합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {lesson.inputFields.map((field) => (
                  <label key={field.label} className="rounded-2xl border bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{field.label}</p>
                    <input
                      value={fields[field.label] ?? ''}
                      onChange={(e) =>
                        setFields((prev) => ({
                          ...prev,
                          [field.label]: e.target.value,
                        }))
                      }
                      className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder={field.placeholder}
                    />
                  </label>
                ))}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[280px] w-full rounded-2xl border bg-slate-50 p-4 text-sm outline-none ring-0 placeholder:text-slate-400"
                placeholder="프롬프트를 입력하세요"
              />

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleRun} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  실행하기
                </Button>
                <Button variant="outline" onClick={() => setPrompt(lesson.defaultPrompt)}>기본 프롬프트로 되돌리기</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>실습 안내</CardTitle>
              <CardDescription>결과만 뽑지 말고 구조와 저장 흐름까지 함께 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">1. 입력</p>
                <p className="mt-2">대상, 톤, 출력 형식을 분명히 적습니다.</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">2. 생성</p>
                <p className="mt-2">AI를 실행해 실제 결과 초안을 받습니다.</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">3. 구조 점검</p>
                <p className="mt-2">우측 인스펙터에서 input/process/output을 봅니다.</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">4. 버전 저장</p>
                <p className="mt-2">초안과 수정본을 따로 남겨 비교합니다.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>{result.title || lesson.title}</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.sections.map((section) => (
                <div key={section.title} className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{section.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>구조 인스펙터</CardTitle>
              <CardDescription>결과와 함께 추가 구조를 확인하는 수업 패널</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="workflow" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="workflow">흐름</TabsTrigger>
                  <TabsTrigger value="format">형식</TabsTrigger>
                  <TabsTrigger value="check">검수</TabsTrigger>
                  <TabsTrigger value="raw">원문</TabsTrigger>
                </TabsList>
                <TabsContent value="workflow" className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">입력</p>
                    <p className="mt-1">{lesson.structure.input}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">처리</p>
                    <p className="mt-1">{lesson.structure.process}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">결과</p>
                    <p className="mt-1">{lesson.structure.output}</p>
                  </div>
                </TabsContent>
                <TabsContent value="format" className="mt-4 space-y-2 text-sm text-slate-600">
                  {lesson.outputFormat.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-4">• {item}</div>
                  ))}
                </TabsContent>
                <TabsContent value="check" className="mt-4 space-y-2 text-sm text-slate-600">
                  {lesson.qualityChecks.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-4">• {item}</div>
                  ))}
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <div className="max-h-[360px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    <pre className="whitespace-pre-wrap">{rawText}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
