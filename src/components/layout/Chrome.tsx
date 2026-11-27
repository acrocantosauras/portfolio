"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { RecruiterModeProvider } from "./RecruiterModeContext";
import { IntroProvider } from "@/components/intro/IntroSequence";
import { Header } from "./Header";
import { RecruiterDrawer } from "./RecruiterDrawer";
import { Cursor } from "./Cursor";
import { SpiderSense } from "./SpiderSense";
import { Thwip } from "./Thwip";
import { HeightenedSenses } from "./HeightenedSenses";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    // Honor prefers-reduced-motion for transform/layout animations at the
    // Motion level (values settle instantly instead of animating), so the
    // per-component reduced-motion branches only decide *what* renders, not
    // whether motion is still applied underneath them.
    <MotionConfig reducedMotion="user">
      <RecruiterModeProvider>
        <IntroProvider>
          <Cursor />
          <SpiderSense />
          <Thwip />
          <Header />
          <RecruiterDrawer />
          {children}
          <HeightenedSenses />
        </IntroProvider>
      </RecruiterModeProvider>
    </MotionConfig>
  );
}
