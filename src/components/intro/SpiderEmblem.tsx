import { useId } from "react";

/**
 * Original spider-emblem artwork — hand-authored symmetric paths (left side
 * mirrored across x=120). Not derived from any existing brand asset.
 *
 * Variants:
 *  - "solid":    single-color silhouette (watermarks, marks, reduced contexts)
 *  - "extruded": comic-masthead treatment — red face + royal-blue depth block,
 *                echoing the film's red-and-blue title treatment.
 */

// Left-side legs, drawn shoulder → elbow → tip, back along the inner edge.
const LEGS = [
  "M110 94 L 74 62 L 32 22 L 80 76 L 110 104 Z", // front, reaches up
  "M106 104 L 56 86 L 8 58 L 60 102 L 106 116 Z", // upper side
  "M106 120 L 58 140 L 10 180 L 64 152 L 108 132 Z", // lower side
  "M112 130 L 78 168 L 54 222 L 92 174 L 116 142 Z", // rear, reaches down
];

// Head + thorax + abdomen + pedipalps (thin hooks framing the head).
const BODY = [
  "M120 77 C 127 77 133 82 133 89 C 133 96 128 101 121 101 C 114 101 109 96 109 89 C 109 82 113 77 120 77 Z", // head
  "M120 95 C 130 95 138 103 138 113 C 138 123 130 131 120 131 C 110 131 102 123 102 113 C 102 103 110 95 120 95 Z", // thorax
  "M120 135 C 138 135 151 152 151 174 C 151 198 138 216 120 226 C 102 216 89 198 89 174 C 89 152 102 135 120 135 Z", // abdomen
];

const PALPS = [
  "M113 83 C 105 74 96 71 87 74 C 93 77 97 82 99 88 Z",
];

type Variant = "solid" | "extruded";

/** The full emblem as flat shapes (used for masks and single-color renders). */
export function EmblemShapes({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      {LEGS.map((d) => (
        <path key={`l-${d}`} d={d} />
      ))}
      <g transform="translate(240,0) scale(-1,1)">
        {LEGS.map((d) => (
          <path key={`r-${d}`} d={d} />
        ))}
      </g>
      {BODY.map((d) => (
        <path key={`b-${d}`} d={d} />
      ))}
      {PALPS.map((d) => (
        <path key={`p-${d}`} d={d} />
      ))}
      <g transform="translate(240,0) scale(-1,1)">
        {PALPS.map((d) => (
          <path key={`pr-${d}`} d={d} />
        ))}
      </g>
    </g>
  );
}

/** Mirror of the left-side artwork, for animated (non-<use>) rendering. */
export function EmblemHalf({ part }: { part: "legs" | "body" | "palps" }) {
  const data = part === "legs" ? LEGS : part === "body" ? BODY : PALPS;
  return (
    <>
      {data.map((d) => (
        <path key={`m-${d}`} d={d} />
      ))}
      <g transform="translate(240,0) scale(-1,1)">
        {data.map((d) => (
          <path key={`m2-${d}`} d={d} />
        ))}
      </g>
    </>
  );
}

export const EMBLEM_PARTS = { LEGS, BODY, PALPS };

export function SpiderEmblem({
  className,
  variant = "solid",
  title,
}: {
  className?: string;
  variant?: Variant;
  title?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const gradId = `emb-grad-${uid}`;

  if (variant === "solid") {
    return (
      <svg
        viewBox="0 0 240 240"
        className={className}
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        <EmblemShapes fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ff4553" />
          <stop offset="46%" stopColor="#e01f2f" />
          <stop offset="100%" stopColor="#7c0d18" />
        </linearGradient>
      </defs>
      {/* royal-blue depth block, offset like the comic masthead */}
      <g transform="translate(5,7)">
        <EmblemShapes fill="var(--color-web-blue)" />
      </g>
      {/* dark separation outline */}
      <g transform="translate(2.5,3.5)">
        <EmblemShapes fill="rgba(3,3,6,0.9)" />
      </g>
      {/* red face */}
      <EmblemShapes fill={`url(#${gradId})`} />
    </svg>
  );
}
