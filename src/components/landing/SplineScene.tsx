'use client';

export default function SplineScene() {
  return (
    <div className="relative h-full w-full">
      <iframe
        src="https://my.spline.design/nexbotrobotcharacterconcept-bFzyvi7hkuFvNt3Iel8ZqT72/"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
        allow="autoplay"
      />
      {/* bottom fade to blend with page */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
    </div>
  );
}
