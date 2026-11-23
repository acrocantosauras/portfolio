"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, [role=button], summary, input, textarea, select, [data-cursor]";

// Fine pointer and motion allowed: read from the browser, false on the server.
function subscribe(cb: () => void) {
  const a = window.matchMedia("(pointer: fine)");
  const b = window.matchMedia("(prefers-reduced-motion: reduce)");
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}
function snapshot() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * A two-part cursor: a dot that tracks the pointer exactly and a ring that
 * trails it on a spring. The ring grows and turns red over anything clickable.
 * Fine pointers only, never with reduced motion, and the native cursor comes
 * back the moment this unmounts. Renders nothing on the server.
 */
export function Cursor() {
  const on = useSyncExternalStore(subscribe, snapshot, () => false);
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("has-custom-cursor");

    function move(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setHot(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    }
    function leave() {
      x.set(-100);
      y.set(-100);
    }
    const downH = () => setDown(true);
    const upH = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", downH);
    window.addEventListener("pointerup", upH);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", downH);
      window.removeEventListener("pointerup", upH);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [on, x, y]);

  if (!on) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <span className="absolute -top-[3px] -left-[3px] block h-1.5 w-1.5 rounded-full bg-signal-red-bright" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="absolute top-0 left-0">
        <motion.span
          className="absolute -top-4 -left-4 block h-8 w-8 rounded-full border"
          animate={{
            scale: down ? 0.7 : hot ? 1.7 : 1,
            borderColor: hot ? "rgba(255,84,69,0.95)" : "rgba(236,230,216,0.55)",
            backgroundColor: hot ? "rgba(255,84,69,0.14)" : "rgba(236,230,216,0)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        />
      </motion.div>
    </div>
  );
}
