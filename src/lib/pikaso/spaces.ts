// Pikaso spaces/pages/elements — Supabase CRUD helpers
import { createBrowserClient } from '@supabase/ssr';
import type { CanvasElement } from '@/types/canvas';

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

// ── Spaces ────────────────────────────────────────────────────

export async function createSpace(title = '새 스페이스'): Promise<string | null> {
  const sb = getClient();
  const { data, error } = await sb
    .from('spaces')
    .insert({ title })
    .select('id')
    .single();
  if (error) {
    console.error('createSpace:', error.message);
    return null;
  }
  return data.id;
}

export async function getSpace(spaceId: string) {
  const sb = getClient();
  const { data, error } = await sb
    .from('spaces')
    .select('*, pages(id, name, order)')
    .eq('id', spaceId)
    .single();
  if (error) return null;
  return data;
}

export async function updateSpaceTitle(spaceId: string, title: string) {
  const sb = getClient();
  await sb.from('spaces').update({ title }).eq('id', spaceId);
}

// ── Pages ─────────────────────────────────────────────────────

export async function createPage(spaceId: string, name = '페이지 1'): Promise<string | null> {
  const sb = getClient();
  const { data, error } = await sb
    .from('pages')
    .insert({ space_id: spaceId, name })
    .select('id')
    .single();
  if (error) {
    console.error('createPage:', error.message);
    return null;
  }
  return data.id;
}

// ── Elements ──────────────────────────────────────────────────

export async function upsertElement(el: CanvasElement) {
  const sb = getClient();
  const { error } = await sb.from('elements').upsert(
    {
      id: el.id,
      page_id: el.pageId,
      type: el.type,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      rotation: el.rotation,
      z_index: el.zIndex,
      data: el.data,
    },
    { onConflict: 'id' }
  );
  if (error) console.error('upsertElement:', error.message);
}

export async function deleteElement(elementId: string) {
  const sb = getClient();
  await sb.from('elements').delete().eq('id', elementId);
}

export async function loadPageElements(pageId: string): Promise<CanvasElement[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from('elements')
    .select('*')
    .eq('page_id', pageId)
    .order('z_index', { ascending: true });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    x: row.x,
    y: row.y,
    width: row.width,
    height: row.height,
    rotation: row.rotation,
    zIndex: row.z_index,
    pageId: row.page_id,
    data: row.data,
  }));
}

// ── Credits ───────────────────────────────────────────────────

export async function getCreditsBalance(): Promise<number> {
  const sb = getClient();
  const { data } = await sb
    .from('credit_accounts')
    .select('balance')
    .single();
  return data?.balance ?? 0;
}

export async function saveGeneration(params: {
  modelId: string;
  type: string;
  prompt: string;
  outputUrls: string[];
  creditsCost: number;
  spaceId?: string;
}): Promise<string | null> {
  const sb = getClient();
  const { data, error } = await sb
    .from('generations')
    .insert({
      model_id: params.modelId,
      type: params.type,
      status: 'completed',
      prompt: params.prompt,
      output_urls: params.outputUrls,
      credits_cost: params.creditsCost,
      space_id: params.spaceId ?? null,
    })
    .select('id')
    .single();
  if (error) {
    console.error('saveGeneration:', error.message);
    return null;
  }
  return data.id;
}
