"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/resume";

type Node = Project["architecture"]["nodes"][number];

const GROUP_ORDER = ["interface", "core", "data", "quality", "observability"];
const GROUP_LABEL: Record<string, string> = {
  interface: "Interface",
  core: "Core",
  data: "Data",
  quality: "Quality",
  observability: "Observability",
};

type Path = { key: string; d: string; active: boolean };

export function ArchitectureDiagram({
  nodes,
  flow,
}: {
  nodes: Node[];
  flow: [string, string][];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = useState<Path[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const usedGroups = GROUP_ORDER.filter((g) => nodes.some((n) => n.group === g));
  const columns = usedGroups.map((g) => nodes.filter((n) => n.group === g));

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const next: Path[] = [];
    for (const [a, b] of flow) {
      const elA = nodeRefs.current.get(a);
      const elB = nodeRefs.current.get(b);
      if (!elA || !elB) continue;
      const ra = elA.getBoundingClientRect();
      const rb = elB.getBoundingClientRect();
      const sameCol = Math.abs(ra.left - rb.left) < 4;
      const x1 = sameCol ? ra.left + ra.width / 2 - cRect.left : ra.right - cRect.left;
      const y1 = sameCol ? ra.bottom - cRect.top : ra.top + ra.height / 2 - cRect.top;
      const x2 = sameCol ? rb.left + rb.width / 2 - cRect.left : rb.left - cRect.left;
      const y2 = sameCol ? rb.top - cRect.top : rb.top + rb.height / 2 - cRect.top;
      const mx = (x1 + x2) / 2;
      const d = sameCol
        ? `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
        : `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      next.push({ key: `${a}-${b}`, d, active: a === activeId || b === activeId });
    }
    setPaths(next);
  }, [flow, activeId]);

  useLayoutEffect(() => {
    recompute();
    const ro = new ResizeObserver(() => recompute());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  const activeNode = nodes.find((n) => n.id === activeId);

  return (
    <div>
      <div
        ref={containerRef}
        className="relative overflow-x-auto"
        onMouseLeave={() => setActiveId(null)}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {paths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill="none"
              stroke={p.active ? "var(--color-signal-red-bright)" : "var(--color-hairline)"}
              strokeWidth={p.active ? 2 : 1.25}
              className="transition-all duration-200"
            />
          ))}
        </svg>

        <div
          className="relative grid min-w-[720px] gap-6 py-4"
          style={{ gridTemplateColumns: `repeat(${usedGroups.length}, minmax(0,1fr))` }}
        >
          {usedGroups.map((group, ci) => (
            <div key={group} className="flex flex-col items-center gap-6">
              <p className="font-mono text-[10px] tracking-[0.25em] text-paper-dim uppercase">
                {GROUP_LABEL[group]}
              </p>
              <div className="flex flex-1 flex-col justify-center gap-6">
                {columns[ci].map((node) => (
                  <div
                    key={node.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={activeId === node.id}
                    data-sense="true"
                    onMouseEnter={() => setActiveId(node.id)}
                    onFocus={() => setActiveId(node.id)}
                    onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
                    className={cn(
                      "w-40 cursor-pointer border-2 bg-ink-panel px-3 py-2.5 text-center transition-colors",
                      activeId === node.id
                        ? "border-signal-red-bright text-paper"
                        : "border-hairline text-paper-dim hover:border-web-blue/60 hover:text-paper"
                    )}
                  >
                    <span className="text-xs leading-tight font-medium">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 min-h-[64px] border border-hairline bg-ink-panel/60 p-4">
        {activeNode ? (
          <>
            <p className="font-mono text-[10px] tracking-[0.25em] text-signal-red-bright uppercase">
              {activeNode.label}
            </p>
            <p className="mt-1 text-sm text-paper/90">{activeNode.detail}</p>
          </>
        ) : (
          <p className="font-mono text-xs text-paper-dim">
            Hover or tap a node to see how it fits.
          </p>
        )}
      </div>
    </div>
  );
}
