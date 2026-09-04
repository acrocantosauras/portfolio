import { Chrome } from "@/components/layout/Chrome";
import { Hero } from "@/components/sections/Hero";
import { Identity } from "@/components/sections/Identity";
import { Journey } from "@/components/sections/Journey";
import { Workshop } from "@/components/sections/Workshop";
import { Missions } from "@/components/sections/Missions";
import { CaseFile } from "@/components/sections/CaseFile";
import { Contact } from "@/components/sections/Contact";
import { FinalScene } from "@/components/sections/FinalScene";

export default function Home() {
  return (
    <Chrome>
      <main>
        <Hero />
        <Identity />
        <Journey />
        <Workshop />
        <Missions />
        <CaseFile />
        <Contact />
      </main>
      <FinalScene />
    </Chrome>
  );
}
