export function buildStructuredPreview(rawText: string) {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const title = lines[0]?.replace(/^#+\s*/, '') || 'AI 결과물';
  const summary = lines.slice(1, 4).join(' ').slice(0, 300) || '요약이 생성되지 않았습니다.';

  const sections: Array<{ title: string; body: string }> = [];
  let currentTitle = '결과';
  let currentBody: string[] = [];

  for (const line of lines.slice(1)) {
    if (/^#{1,6}\s+/.test(line)) {
      if (currentBody.length) {
        sections.push({ title: currentTitle, body: currentBody.join('\n') });
      }
      currentTitle = line.replace(/^#{1,6}\s*/, '');
      currentBody = [];
      continue;
    }
    currentBody.push(line);
  }

  if (currentBody.length) {
    sections.push({ title: currentTitle, body: currentBody.join('\n') });
  }

  if (!sections.length) {
    sections.push({ title: '결과', body: rawText });
  }

  return { title, summary, sections };
}
