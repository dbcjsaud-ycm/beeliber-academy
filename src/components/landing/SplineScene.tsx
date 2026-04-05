'use client';

export default function SplineScene() {
  return (
    /* 로봇을 좌측으로 당기기 — iframe을 6% 왼쪽으로 밀고 폭 보상 */
    <div style={{
      position: 'absolute',
      top: 0,
      left: '-6%',
      width: '106%',
      height: '100%',
    }}>
      <iframe
        src="https://my.spline.design/nexbotrobotcharacterconcept-bFzyvi7hkuFvNt3Iel8ZqT72/"
        frameBorder="0"
        allow="autoplay"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
