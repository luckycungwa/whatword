interface AuraBackgroundProps {
  children: React.ReactNode;
}

/**
 * Arctic Paper — Aura Gradient (grain)
 * Base color #faf8f2 lives on <body> — this container stays transparent
 * so multiply blends against the page.
 */
export function AuraBackground({ children }: AuraBackgroundProps) {
  return (
    <div
      className="aura-root"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Layer 1 — normal */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(145deg, #f8fafc 0%, #e0f2fe 38%, #bae6fd 68%, #dbeafe 100%)',
          mixBlendMode: 'normal',
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2 — multiply, blur 88px mobile / 126px desktop */}
      <div
        aria-hidden="true"
        className="aura-layer-2"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 40% at 35% 42%, rgba(125,211,252,0.22) 0%, transparent 60%)',
          mixBlendMode: 'multiply',
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* Grain — overlay 0.85 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'overlay',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <filter id="aura-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves={4}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0.181 0.608 0.061 0 0.075
                      0     0     0     1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#aura-grain)" />
        </svg>
      </div>

      {/* Content sits above decorative layers */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>

      <style>{`
        .aura-layer-2 { filter: blur(88px); }
        @media (min-width: 768px) {
          .aura-layer-2 { filter: blur(126px); }
        }
      `}</style>
    </div>
  );
}
