"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void; toggle: () => void };

const RecruiterModeContext = createContext<Ctx | null>(null);

export function RecruiterModeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <RecruiterModeContext.Provider
      value={{ open, setOpen, toggle: () => setOpen((v) => !v) }}
    >
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode() {
  const ctx = useContext(RecruiterModeContext);
  if (!ctx) {
    throw new Error("useRecruiterMode must be used within RecruiterModeProvider");
  }
  return ctx;
}
