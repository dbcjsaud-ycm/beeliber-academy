import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';

const CreateDocumentSchema = z.object({
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  title: z.string().min(1),
  promptText: z.string().min(1),
  inputPayload: z.record(z.string(), z.any()),
  outputPayload: z.record(z.string(), z.any()),
  aiProvider: z.string().default('openai'),
  aiModel: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const trackSlug = searchParams.get('track');
  const lessonSlug = searchParams.get('lesson');

  let query = supabase
    .from('workspace_documents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (trackSlug) query = query.eq('track_slug', trackSlug);
  if (lessonSlug) query = query.eq('lesson_slug', lessonSlug);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, documents: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const body = CreateDocumentSchema.parse(json);

    const { data: document, error: documentError } = await supabase
      .from('workspace_documents')
      .insert({
        user_id: user.id,
        track_slug: body.trackSlug,
        lesson_slug: body.lessonSlug,
        title: body.title,
        status: 'draft',
        current_version_no: 1,
      })
      .select('*')
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        { ok: false, error: documentError?.message ?? 'FAILED_TO_CREATE_DOCUMENT' },
        { status: 500 },
      );
    }

    const { data: version, error: versionError } = await supabase
      .from('workspace_document_versions')
      .insert({
        document_id: document.id,
        user_id: user.id,
        version_no: 1,
        prompt_text: body.promptText,
        input_payload: body.inputPayload,
        output_payload: body.outputPayload,
        ai_provider: body.aiProvider,
        ai_model: body.aiModel,
        notes: body.notes ?? null,
      })
      .select('*')
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { ok: false, error: versionError?.message ?? 'FAILED_TO_CREATE_VERSION' },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from('workspace_documents')
      .update({
        current_version_id: version.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', document.id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      document: {
        ...document,
        current_version_id: version.id,
      },
      version,
    });
  } catch (error) {
    console.error('[POST /api/workspace] error', error);
    return NextResponse.json({ ok: false, error: 'FAILED_TO_CREATE_WORKSPACE_DOCUMENT' }, { status: 500 });
  }
}
