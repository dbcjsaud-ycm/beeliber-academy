import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ documentId: string; versionId: string }> },
) {
  const { documentId, versionId } = await params;
  const { supabase, user } = await requireUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { data: document, error: documentError } = await supabase
    .from('workspace_documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (documentError || !document) {
    return NextResponse.json({ ok: false, error: documentError?.message ?? 'DOCUMENT_NOT_FOUND' }, { status: 404 });
  }

  const { data: sourceVersion, error: versionError } = await supabase
    .from('workspace_document_versions')
    .select('*')
    .eq('id', versionId)
    .eq('document_id', documentId)
    .single();

  if (versionError || !sourceVersion) {
    return NextResponse.json({ ok: false, error: versionError?.message ?? 'VERSION_NOT_FOUND' }, { status: 404 });
  }

  const nextVersionNo = (document.current_version_no ?? 0) + 1;

  const { data: restoredVersion, error: restoreError } = await supabase
    .from('workspace_document_versions')
    .insert({
      document_id: documentId,
      user_id: user.id,
      version_no: nextVersionNo,
      prompt_text: sourceVersion.prompt_text,
      input_payload: sourceVersion.input_payload,
      output_payload: sourceVersion.output_payload,
      ai_provider: sourceVersion.ai_provider,
      ai_model: sourceVersion.ai_model,
      notes: `Restored from version ${sourceVersion.version_no}`,
    })
    .select('*')
    .single();

  if (restoreError || !restoredVersion) {
    return NextResponse.json({ ok: false, error: restoreError?.message ?? 'FAILED_TO_RESTORE_VERSION' }, { status: 500 });
  }

  const { data: updatedDocument, error: updateError } = await supabase
    .from('workspace_documents')
    .update({
      current_version_no: nextVersionNo,
      current_version_id: restoredVersion.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId)
    .select('*')
    .single();

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, document: updatedDocument, version: restoredVersion });
}
