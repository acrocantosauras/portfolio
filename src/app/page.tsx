import { Chrome } from "@/components/layout/Chrome";
import { WebThread } from "@/components/layout/WebThread";
import { SlugLine } from "@/components/layout/SlugLine";
import { RooftopScene } from "@/components/scenes/RooftopScene";
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
import { SCENES } from "@/lib/rooftop";

/**
 * The Rooftop Run. One night in New York, from 2:41 AM to first light, told as a
 * run across rooftops: a layered scene sits between every pair of chapters, and
 * the roof you land on is the floor of the next chapter. The sky, the skyline's
 * colours and the number of lit windows move from deep night to morning across
 * the nine scenes, and a single web strand ties them together.
 *
 * Navigation links jump straight to the chapter ids, so nobody has to scroll
 * through the scenes.
 */
export default function Home() {
  return (
    <Chrome>
      <SlugLine />
      <WebThread>
        <main>
          <Hero />
          <RooftopScene spec={SCENES[0]} />
          <AegisForge />
          <RooftopScene spec={SCENES[1]} />
          <UchitVision />
          <RooftopScene spec={SCENES[2]} />
          <Missions />
          <RooftopScene spec={SCENES[3]} />
          <Workshop />
          <RooftopScene spec={SCENES[4]} />
          <Identity />
          <RooftopScene spec={SCENES[5]} />
          <Journey />
          <RooftopScene spec={SCENES[6]} />
          <CaseFile />
          <RooftopScene spec={SCENES[7]} />
          <Contact />
          <RooftopScene spec={SCENES[8]} />
        </main>
      </WebThread>
      <FinalScene />
    </Chrome>
  );
}
