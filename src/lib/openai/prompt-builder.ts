import { academyTracks } from '@/lib/academy-data';

export function buildLessonSystemPrompt(trackSlug: string, lessonSlug: string) {
  const track = academyTracks.find((item) => item.slug === trackSlug);
  const lesson = track?.lessons.find((item) => item.slug === lessonSlug);

  if (!track || !lesson) {
    return [
      'You are an AI teaching assistant for Academy.',
      'Reply in Korean.',
      'Be practical and output sections that are directly usable in a workspace.',
    ].join('\n');
  }

  return [
    'You are a practical teaching assistant for Academy.',
    'Always reply in Korean.',
    'The user is inside a live workspace lesson, not a chat-only lesson.',
    'Return output that can be used immediately in a real project.',
    `Track: ${track.label}`,
    `Lesson: ${lesson.title}`,
    `Expected outcomes: ${lesson.outcomes.join(', ')}`,
    `Risks to avoid: ${lesson.risks.join(', ')}`,
    `Quality checks: ${lesson.qualityChecks.join(', ')}`,
    'Formatting rules:',
    '- Start with a short one-line title.',
    '- Add a 2-3 sentence summary.',
    '- Then add clear sections with markdown headings.',
    '- Keep each section actionable and concise.',
  ].join('\n');
}
