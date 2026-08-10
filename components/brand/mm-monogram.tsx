import { useId } from "react";

/**
 * A lightweight vector interpretation of the interlocked MetricMend mark.
 * It intentionally has no background tile, so it can sit directly on the
 * navigation, hero, footer, or any future surface without showing an image
 * boundary. Metallic depth comes from gradients and fine highlight strokes.
 */
export function MMMonogram({
  size = 40,
  className,
  decorative = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  const gold = `${uid}-gold`;
  const goldEdge = `${uid}-gold-edge`;
  const steel = `${uid}-steel`;
  const steelEdge = `${uid}-steel-edge`;
  const shadow = `${uid}-shadow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "MetricMend AI"}
    >
      <defs>
        <linearGradient id={gold} x1="8" y1="5" x2="78" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff0b6" />
          <stop offset="0.18" stopColor="#e7ba43" />
          <stop offset="0.5" stopColor="#a96b08" />
          <stop offset="0.72" stopColor="#f0bd33" />
          <stop offset="1" stopColor="#76500f" />
        </linearGradient>
        <linearGradient id={goldEdge} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff8d5" />
          <stop offset="0.45" stopColor="#f1c75d" />
          <stop offset="1" stopColor="#80500a" />
        </linearGradient>
        <linearGradient id={steel} x1="30" y1="3" x2="92" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6f8fc" />
          <stop offset="0.22" stopColor="#9da8bd" />
          <stop offset="0.52" stopColor="#30394b" />
          <stop offset="0.78" stopColor="#151c29" />
          <stop offset="1" stopColor="#738096" />
        </linearGradient>
        <linearGradient id={steelEdge} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="0.48" stopColor="#aeb9cc" />
          <stop offset="1" stopColor="#3b465b" />
        </linearGradient>
        <filter id={shadow} x="-25%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#000" floodOpacity="0.72" />
        </filter>
      </defs>

      <g filter={`url(#${shadow})`} strokeLinejoin="miter">
        {/* Right half of the large M. */}
        <path
          d="M47 48 88 6v88L76 80V34L56 57Z"
          fill={`url(#${steel})`}
          stroke={`url(#${steelEdge})`}
          strokeWidth="1.15"
        />

        {/* Left half crosses above the steel ribbon at the center. */}
        <path
          d="M10 94V6l49 51-8 9-29-31v45Z"
          fill={`url(#${gold})`}
          stroke={`url(#${goldEdge})`}
          strokeWidth="1.15"
        />

        {/* Nested M, with the metals reversed. */}
        <path
          d="M47 73 70 49v45L59 82V72l-4 9Z"
          fill={`url(#${gold})`}
          stroke={`url(#${goldEdge})`}
          strokeWidth="1.1"
        />
        <path
          d="M29 94V49l29 31-8 9-10-11v4Z"
          fill={`url(#${steel})`}
          stroke={`url(#${steelEdge})`}
          strokeWidth="1.1"
        />

        {/* Hairline bevels keep the mark legible at hero scale. */}
        <path d="M13 89V12l42 44" fill="none" stroke="#fff2b3" strokeOpacity=".72" strokeWidth=".75" />
        <path d="M50 49 85 12v75" fill="none" stroke="#f7f9ff" strokeOpacity=".7" strokeWidth=".75" />
        <path d="M32 89V56l21 23" fill="none" stroke="#f7f9ff" strokeOpacity=".58" strokeWidth=".65" />
        <path d="M51 73 67 56v31" fill="none" stroke="#fff2b3" strokeOpacity=".58" strokeWidth=".65" />
      </g>
    </svg>
  );
}
