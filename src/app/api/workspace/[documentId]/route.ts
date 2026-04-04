import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
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
    return NextResponse.json({ ok: false, error: documentError?.message ?? 'NOT_FOUND' }, { status: 404 });
  }

  const { data: versions, error: versionsError } = await supabase
    .from('workspace_document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_no', { ascending: false });

  if (versionsError) {
    return NextResponse.json({ ok: false, error: versionsError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    document,
    versions: versions ?? [],
  });
}
