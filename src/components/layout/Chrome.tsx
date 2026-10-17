"use client";

import type { ReactNode } from "react";
import { RecruiterModeProvider } from "./RecruiterModeContext";
import { IntroProvider } from "@/components/intro/IntroSequence";
import { Header } from "./Header";
import { RecruiterDrawer } from "./RecruiterDrawer";
import { FilmGrain } from "./FilmGrain";
import { ScrollProgress } from "./ScrollProgress";
import { SpiderSense } from "./SpiderSense";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <RecruiterModeProvider>
      <IntroProvider>
        <FilmGrain />
        <SpiderSense />
        <ScrollProgress />
        <Header />
        <RecruiterDrawer />
        {children}
      </IntroProvider>
    </RecruiterModeProvider>
  );
}
