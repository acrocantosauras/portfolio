/** Multi-layer NYC-style skyline used in the intro, hero and closing scene. */
export function Skyline({
  className,
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 1440 260"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <rect x="0" y="120" width="60" height="140" fill="currentColor" />
      <rect x="70" y="60" width="40" height="200" fill="currentColor" />
      <rect x="120" y="150" width="80" height="110" fill="currentColor" />
      <rect x="215" y="90" width="50" height="170" fill="currentColor" />
      <rect x="280" y="20" width="46" height="240" fill="currentColor" />
      <rect x="335" y="130" width="70" height="130" fill="currentColor" />
      <rect x="420" y="70" width="55" height="190" fill="currentColor" />
      <rect x="490" y="160" width="90" height="100" fill="currentColor" />
      <rect x="595" y="40" width="42" height="220" fill="currentColor" />
      <rect x="650" y="100" width="65" height="160" fill="currentColor" />
      <rect x="730" y="0" width="50" height="260" fill="currentColor" />
      <rect x="795" y="140" width="75" height="120" fill="currentColor" />
      <rect x="880" y="70" width="48" height="190" fill="currentColor" />
      <rect x="940" y="160" width="90" height="100" fill="currentColor" />
      <rect x="1045" y="30" width="46" height="230" fill="currentColor" />
      <rect x="1100" y="110" width="60" height="150" fill="currentColor" />
      <rect x="1175" y="150" width="80" height="110" fill="currentColor" />
      <rect x="1265" y="60" width="45" height="200" fill="currentColor" />
      <rect x="1320" y="130" width="120" height="130" fill="currentColor" />
      <g fill="var(--color-amber)" opacity="0.55">
        <rect x="85" y="80" width="4" height="4" />
        <rect x="230" y="120" width="4" height="4" />
        <rect x="295" y="60" width="4" height="4" />
        <rect x="440" y="110" width="4" height="4" />
        <rect x="610" y="90" width="4" height="4" />
        <rect x="745" y="40" width="4" height="4" />
        <rect x="900" y="110" width="4" height="4" />
        <rect x="1060" y="70" width="4" height="4" />
        <rect x="1190" y="190" width="4" height="4" />
        <rect x="1345" y="170" width="4" height="4" />
      </g>
    </svg>
  );
}
