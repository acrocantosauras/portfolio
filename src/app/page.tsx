import { Chrome } from "@/components/layout/Chrome";
import { Hero } from "@/components/sections/Hero";
import { AegisForge } from "@/components/sections/AegisForge";
import { UchitVision } from "@/components/sections/UchitVision";
import { Missions } from "@/components/sections/Missions";
import { Workshop } from "@/components/sections/Workshop";
import { Identity } from "@/components/sections/Identity";
import { Journey } from "@/components/sections/Journey";
import { CaseFile } from "@/components/sections/CaseFile";
import { Contact } from "@/components/sections/Contact";
import { FinalScene } from "@/components/sections/FinalScene";

export default function Home() {
  return (
    <Chrome>
      <main>
        <Hero />
        <AegisForge />
        <UchitVision />
        <Missions />
        <Workshop />
        <Identity />
        <Journey />
        <CaseFile />
        <Contact />
      </main>
      <FinalScene />
    </Chrome>
  );
}
