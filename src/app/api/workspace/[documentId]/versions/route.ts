import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';

const CreateVersionSchema = z.object({
  promptText: z.string().min(1),
  inputPayload: z.record(z.string(), z.any()),
  outputPayload: z.record(z.string(), z.any()),
  aiProvider: z.string().default('openai'),
  aiModel: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('workspace_document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_no', { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, versions: data ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const body = CreateVersionSchema.parse(json);

    const { data: document, error: documentError } = await supabase
      .from('workspace_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError || !document) {
      return NextResponse.json({ ok: false, error: documentError?.message ?? 'DOCUMENT_NOT_FOUND' }, { status: 404 });
    }

    const nextVersionNo = (document.current_version_no ?? 0) + 1;

    const { data: version, error: versionError } = await supabase
      .from('workspace_document_versions')
      .insert({
        document_id: documentId,
        user_id: user.id,
        version_no: nextVersionNo,
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
      return NextResponse.json({ ok: false, error: versionError?.message ?? 'FAILED_TO_CREATE_VERSION' }, { status: 500 });
    }

    const { data: updatedDocument, error: updateError } = await supabase
      .from('workspace_documents')
      .update({
        current_version_no: nextVersionNo,
        current_version_id: version.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, document: updatedDocument, version });
  } catch (error) {
    console.error('[POST /api/workspace/[documentId]/versions] error', error);
    return NextResponse.json({ ok: false, error: 'FAILED_TO_CREATE_VERSION' }, { status: 500 });
  }
}
