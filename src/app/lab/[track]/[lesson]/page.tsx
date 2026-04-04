import { notFound } from 'next/navigation';
import { academyTracks } from '@/lib/academy-data';
import { LessonWorkspace } from '@/components/workspace/LessonWorkspace';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; lesson: string }>;
}) {
  const { track: trackSlug, lesson: lessonSlug } = await params;

  const track = academyTracks.find((item) => item.slug === trackSlug);
  const lesson = track?.lessons.find((item) => item.slug === lessonSlug);

  if (!track || !lesson) {
    notFound();
  }

  return <LessonWorkspace track={track} lesson={lesson} />;
}
