"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion flag.
 *
 * motion/react's `useReducedMotion()` answers the media query synchronously
 * on the very first client render. When a component branches its rendered
 * markup, variants, or initial props on that value, the first client tree no
 * longer matches the server HTML and React fails hydration with a
 * server/client text mismatch (reproducible with
 * `.shots/repro-reduced-motion.mjs` against a dev server).
 *
 * This hook always answers `false` during SSR and the first client render —
 * so the tree matches the server — and only then reflects the real media
 * query. Reduced-motion branches therefore take effect immediately after
 * hydration instead of during it. For instant (rather than animated)
 * transform transitions under reduced motion, the app is additionally wrapped
 * in `<MotionConfig reducedMotion="user">` (see layout/Chrome.tsx).
 */
export function useReducedMotionSafe(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return reduce;
}
