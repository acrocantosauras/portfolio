"use client";

import { useId, useMemo, useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import {
  ANCHORS,
  VB_H,
  VB_W,
  buildScene,
  mix,
  palette,
  type Palette,
  type SceneSpec,
  type Variant,
} from "@/lib/rooftop";

/** The rooftop line the foreground stands on: y at a given x in scene space. */
const groundY = (x: number) => 450 + (x + 40) * 0.02024;

function Landmark({ variant, pal }: { variant: Variant; pal: Palette }) {
  const c = pal.obj;
  const edge = mix(pal.obj, pal.skyHor, 0.55);
  const lit = "#f2c230";

  switch (variant) {
    case "antenna": {
      const braces: string[] = [];
      for (let y = 160; y < 470; y += 46) {
        const half = 6 + ((y - 130) / 350) * 24;
        braces.push(`M${1190 - half} ${y}L${1190 + half} ${y + 46}M${1190 + half} ${y}L${1190 - half} ${y + 46}`);
      }
      return (
        <g>
          <path d={`M1170 482L1190 140L1210 482`} fill="none" stroke={c} strokeWidth="5" />
          <path d={braces.join("")} fill="none" stroke={c} strokeWidth="2.5" />
          <path d="M1190 140V108" stroke={c} strokeWidth="3" />
          <circle cx="1190" cy="104" r="5" fill="#ff5445" className="beacon" />
          <path d="M1182 300H1198M1178 220H1202" stroke={c} strokeWidth="3" />
          <rect x="360" y="400" width="26" height="80" fill={c} />
          <rect x="352" y="394" width="42" height="9" fill={c} />
        </g>
      );
    }
    case "bridge": {
      const hangers: string[] = [];
      for (let x = 470; x <= 1110; x += 36) {
        const t = (x - 430) / 720;
        const y = 204 + 352 * t * (1 - t);
        hangers.push(`M${x} ${y.toFixed(1)}V434`);
      }
      return (
        <g>
          <rect x="414" y="190" width="30" height="294" fill={c} />
          <rect x="1135" y="190" width="30" height="294" fill={c} />
          <rect x="408" y="182" width="42" height="14" fill={c} />
          <rect x="1129" y="182" width="42" height="14" fill={c} />
          <rect x="-40" y="428" width="1680" height="9" fill={c} />
          <path d="M429 202Q790 382 1150 202M429 202L-40 428M1150 202L1640 428" fill="none" stroke={c} strokeWidth="4" />
          <path d={hangers.join("")} stroke={edge} strokeWidth="1.6" fill="none" />
          <circle cx="429" cy="178" r="3.5" fill="#ff5445" className="beacon" />
          <circle cx="1150" cy="178" r="3.5" fill="#ff5445" className="beacon" />
        </g>
      );
    }
    case "watertower": {
      const tower = (x: number, k: number, base: number) => (
        <g transform={`translate(${x} ${base}) scale(${k})`}>
          <path d="M-46 -150V-80H46V-150L0 -176Z" fill={c} />
          <rect x="-46" y="-150" width="92" height="72" fill={c} />
          <path d="M-38 -80L-46 0M38 -80L46 0M-12 -80L-14 0M12 -80L14 0M-40 -50H42M-44 -22H44" stroke={c} strokeWidth="3.5" fill="none" />
          <path d="M-46 -122H46M-46 -100H46" stroke={edge} strokeWidth="1.5" opacity="0.7" />
        </g>
      );
      return (
        <g>
          {tower(1010, 1, 480)}
          {tower(420, 0.62, 462)}
          <rect x="1180" y="420" width="64" height="62" fill={c} />
          <rect x="1176" y="414" width="72" height="9" fill={c} />
        </g>
      );
    }
    case "billboard":
      return (
        <g>
          <path d="M850 372V482M1030 372V482" stroke={c} strokeWidth="9" />
          <rect x="780" y="246" width="330" height="128" fill={c} />
          <rect x="792" y="258" width="306" height="104" fill="none" stroke={lit} strokeOpacity="0.55" strokeWidth="2" />
          <rect x="792" y="258" width="306" height="104" fill={lit} fillOpacity={0.05 + pal.lights * 0.1} />
          <path d="M810 280H1070M810 300H1010M810 320H1050" stroke={lit} strokeOpacity={0.12 + pal.lights * 0.2} strokeWidth="6" />
          <rect x="780" y="374" width="330" height="9" fill={c} />
          {[800, 940, 1080].map((x) => (
            <circle key={x} cx={x} cy="238" r="4" fill={lit} opacity={0.3 + pal.lights * 0.6} />
          ))}
        </g>
      );
    case "fireescape": {
      const flights: string[] = [];
      [336, 392, 448].forEach((y, i) => {
        flights.push(`M1020 ${y}H1130`);
        if (i < 2) flights.push(`M1130 ${y}L1030 ${y + 56}`);
      });
      return (
        <g>
          <rect x="980" y="300" width="320" height="190" fill={c} />
          <path d={flights.join("")} stroke={edge} strokeWidth="4" fill="none" />
          <path d="M1022 336V470M1128 336V470" stroke={edge} strokeWidth="2" fill="none" />
          <path d="M1170 330h26v34h-26zM1230 330h26v34h-26zM1170 400h26v34h-26zM1230 400h26v34h-26z" fill={lit} fillOpacity={0.15 + pal.lights * 0.5} />
          <rect x="1262" y="270" width="16" height="30" fill={c} />
        </g>
      );
    }
    case "spire":
      return (
        <g>
          <path d="M984 392L1098 336L1212 392Z" fill={c} />
          <rect x="992" y="388" width="212" height="96" fill={c} />
          <rect x="1058" y="256" width="64" height="228" fill={c} />
          <path d="M1054 256L1090 118L1126 256Z" fill={c} />
          <path d="M1090 118V92M1080 104H1100" stroke={c} strokeWidth="3.5" />
          <path d="M1078 300h24v46h-24z" fill={lit} fillOpacity={0.1 + pal.lights * 0.45} />
        </g>
      );
    case "chimney":
      return (
        <g>
          <rect x="-40" y="452" width="1680" height="40" fill={c} />
          {[
            [900, 34, 140],
            [1010, 28, 120],
            [1120, 40, 160],
          ].map(([x, w, h]) => (
            <g key={x}>
              <rect x={x} y={470 - h} width={w} height={h} fill={c} />
              <rect x={x - 5} y={466 - h} width={w + 10} height="8" fill={c} />
            </g>
          ))}
          <path d="M917 322q-16 -30 6 -58t-6 -54M1138 300q-14 -32 8 -62t-4 -56" fill="none" stroke={edge} strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "rooftop":
      return (
        <g>
          <rect x="930" y="396" width="116" height="80" fill={c} />
          <circle cx="988" cy="436" r="22" fill="none" stroke={edge} strokeWidth="3" />
          <path d="M1070 476V380h28V476M1070 380h50" stroke={c} strokeWidth="9" fill="none" />
          <path d="M760 476V410M760 410H870" stroke={c} strokeWidth="5" fill="none" />
          <path d="M1210 476V300M1190 330H1230M1196 360H1224" stroke={c} strokeWidth="4" fill="none" />
          <path d="M-40 440H420" stroke={c} strokeWidth="4" />
          <path d="M-40 440V480M120 440V480M260 440V480M400 440V480" stroke={c} strokeWidth="3" />
        </g>
      );
    default:
      return (
        <g>
          <g transform="translate(1290 470) scale(0.7)">
            <path d="M-46 -150V-80H46V-150L0 -176Z" fill={c} />
            <rect x="-46" y="-150" width="92" height="72" fill={c} />
            <path d="M-38 -80L-46 0M38 -80L46 0" stroke={c} strokeWidth="4" fill="none" />
          </g>
          <path d="M760 476V360M730 376L760 360L790 376M744 404H776" stroke={c} strokeWidth="4" fill="none" />
          <rect x="520" y="420" width="90" height="60" fill={c} />
          <rect x="1010" y="428" width="60" height="50" fill={c} />
        </g>
      );
  }
}

/**
 * One scene of the Rooftop Run: a slice of the New York night (or dawn) between
 * two chapters.
 *
 * Depth, back to front: sky and sun, stars, far skyline, middle skyline with lit
 * windows, then the foreground: a landmark standing on a rooftop whose surface IS
 * the colour of the next chapter, so you walk off the roof into it. Each layer
 * moves at its own speed with scroll, and the foreground also rises, so the camera
 * seems to drop toward the roof. A web strand swings in from off-screen, attaches
 * to the landmark and swings back out, drawn by scroll.
 *
 * It is decorative (aria-hidden), costs only transforms while scrolling, and for
 * reduced motion renders one still, fully drawn composition.
 */
export function RooftopScene({ spec }: { spec: SceneSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotionSafe();
  const pal = useMemo(() => palette(spec.t), [spec.t]);
  const data = useMemo(() => buildScene(spec.seed, pal.lights), [spec.seed, pal.lights]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useMotionValue(0.5);
  const p = reduce ? still : scrollYProgress;

  // each layer shifts by a share of its own width, so it can never expose an edge
  const farX = useTransform(p, [0, 1], ["0%", "-9%"]);
  const midX = useTransform(p, [0, 1], ["0%", "-20%"]);
  const fgX = useTransform(p, [0, 1], ["0%", "-7.4%"]);
  const farY = useTransform(p, [0, 1], [0, 18]);
  const midY = useTransform(p, [0, 1], [34, -14]);
  const fgY = useTransform(p, [0, 1], [70, -18]);
  const glowY = useTransform(p, [0, 1], [110, -30]);
  const draw1 = useTransform(p, [0.1, 0.46], [0, 1]);
  const draw2 = useTransform(p, [0.4, 0.78], [0, 1]);
  const nodeScale = useTransform(p, [0.36, 0.5], [0, 1]);

  const a = ANCHORS[spec.variant];
  const day = spec.t >= 0.72;
  const strand = day ? "#14161b" : "#ece6d8";
  const sky = `linear-gradient(to bottom, ${spec.from} 0%, ${pal.skyMid} 42%, ${pal.skyHor} 80%, ${pal.skyHor} 100%)`;

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-[330px] w-full overflow-hidden sm:h-[460px]"
      style={{ background: sky }}
    >
      {/* the sun: only in the dawn scenes, rising with the scroll */}
      {pal.sun > 0.02 && (
        <motion.div
          style={{ y: glowY, opacity: pal.sun }}
          className="absolute right-[10%] bottom-[2%] h-[360px] w-[360px] rounded-full sm:h-[520px] sm:w-[520px]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,226,160,0.95) 0%, rgba(255,170,100,0.45) 36%, rgba(255,140,90,0) 70%)",
            }}
          />
        </motion.div>
      )}

      {/* far skyline + stars */}
      <motion.div style={{ x: farX, y: farY }} className="absolute inset-y-0 left-0 w-[110%]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          {data.stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ece6d8" opacity={Math.max(0, 0.75 - spec.t * 1.1)} />
          ))}
          <path d={data.farPath} fill={pal.far} />
        </svg>
      </motion.div>

      {/* middle skyline with its lit windows */}
      <motion.div style={{ x: midX, y: midY }} className="absolute inset-y-0 left-0 w-[125%]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <path d={data.midPath} fill={pal.mid} />
          <path d={data.windowsPath} fill="#f2c230" opacity={0.55 + pal.lights * 0.3} />
        </svg>
      </motion.div>

      {/* foreground: landmark, rooftop, seam, web strand */}
      <motion.div style={{ x: fgX, y: fgY }} className="absolute inset-y-0 left-0 w-[108%]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full overflow-visible">
          <defs>
            <pattern id={`weave-${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="10" height="10" fill="#e0342b" />
              <rect width="10" height="1.6" fill="#05060b" opacity="0.75" />
              <rect y="1.6" width="10" height="1" fill="#ffffff" opacity="0.16" />
            </pattern>
          </defs>

          <Landmark variant={spec.variant} pal={pal} />

          {/* the web: in from off-screen, onto the landmark, and back out */}
          <motion.path
            d={`M-90 20C320 -30 ${a.x - 380} ${a.y - 120} ${a.x} ${a.y}`}
            fill="none"
            stroke={strand}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeOpacity="0.88"
            style={{ pathLength: reduce ? 1 : draw1 }}
          />
          <motion.path
            d={`M${a.x} ${a.y}C${a.x - 260} ${a.y + 170} 260 600 -90 520`}
            fill="none"
            stroke={strand}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeOpacity="0.88"
            style={{ pathLength: reduce ? 1 : draw2 }}
          />
          <motion.g style={{ scale: reduce ? 1 : nodeScale, transformOrigin: `${a.x}px ${a.y}px` }}>
            <circle cx={a.x} cy={a.y} r="11" fill="none" stroke="#ff5445" strokeOpacity="0.6" strokeWidth="1.5" />
            <circle cx={a.x} cy={a.y} r="5.5" fill="#ff5445" />
          </motion.g>

          {/* the rooftop itself: the colour of the next chapter */}
          <path d={`M-90 ${groundY(-90)}L1700 ${groundY(1700)}V${VB_H + 60}H-90Z`} fill={spec.to} />
          {/* the seam of the suit along its edge */}
          <path
            d={`M-90 ${groundY(-90) - 10}L1700 ${groundY(1700) - 10}V${groundY(1700)}L-90 ${groundY(-90)}Z`}
            fill={`url(#weave-${id})`}
          />
        </svg>
      </motion.div>
    </div>
  );
}
