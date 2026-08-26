"use client";

import { useEffect, useRef, useState } from "react";

type Macro = {
  label: string;
  grams: number;
  percent: number;
  color: string;
};

const MACROS: Macro[] = [
  { label: "Węglowodany", grams: 232, percent: 45, color: "#FF6B35" },
  { label: "Białko", grams: 158, percent: 30, color: "#8FA34E" },
  { label: "Tłuszcze", grams: 58, percent: 25, color: "#E8B34C" },
];

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const KCAL_TARGET = 2140;

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return value;
}

export default function AnimatedHeroCard() {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"generating" | "done">("generating");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealTimer = setTimeout(() => setReady(true), prefersReducedMotion ? 0 : 250);
    const statusTimer = setTimeout(
      () => setStatus("done"),
      prefersReducedMotion ? 0 : 2000
    );

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(statusTimer);
    };
  }, []);

  const kcal = useCountUp(KCAL_TARGET, ready);

  let cumulative = 0;

  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-[28px] border border-white/10 bg-ink text-paper p-6 sm:p-8 shadow-[0_30px_60px_-25px_rgba(27,58,47,0.6)]">
        {/* status row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full bg-carrot ${
                status === "generating" ? "animate-pulse-dot" : ""
              }`}
            />
            <span className="eyebrow text-paper/70">
              {status === "generating" ? "Generowanie planu…" : "Plan gotowy"}
            </span>
          </div>
          <span className="font-mono text-[11px] text-paper/40">PON · TYDZIEŃ 1</span>
        </div>

        {/* donut + kcal */}
        <div className="flex items-center gap-6">
          <svg
            viewBox="0 0 200 200"
            className="h-40 w-40 shrink-0 -rotate-90"
            role="img"
            aria-label="Rozkład makroskładników: węglowodany 45%, białko 30%, tłuszcze 25%"
          >
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="rgba(243,246,240,0.08)"
              strokeWidth="16"
            />
            {MACROS.map((macro) => {
              const len = (macro.percent / 100) * CIRCUMFERENCE;
              const offset = -((cumulative / 100) * CIRCUMFERENCE);
              cumulative += macro.percent;
              return (
                <circle
                  key={macro.label}
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke={macro.color}
                  strokeWidth="16"
                  strokeLinecap="butt"
                  strokeDasharray={ready ? `${len} ${CIRCUMFERENCE - len}` : `0 ${CIRCUMFERENCE}`}
                  strokeDashoffset={offset}
                  style={{
                    transition: "stroke-dasharray 1.1s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              );
            })}
          </svg>

          <div>
            <p className="font-mono text-4xl leading-none tabular-nums">{kcal}</p>
            <p className="eyebrow text-paper/50 mt-2">kcal / dzień</p>
          </div>
        </div>

        {/* macro rows — nutrition-label style */}
        <div className="mt-6 border-t-2 border-paper/20 pt-4">
          <div className="space-y-3">
            {MACROS.map((macro) => (
              <div key={macro.label} className="flex items-center justify-between font-mono text-sm">
                <span className="flex items-center gap-2 text-paper/80">
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ backgroundColor: macro.color }}
                  />
                  {macro.label}
                </span>
                <span className="tabular-nums text-paper/60">
                  {ready ? macro.grams : 0} g · {macro.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating chip */}
      <div className="hidden sm:flex absolute -bottom-5 -left-6 items-center gap-2 rounded-full bg-paper border border-line px-4 py-2 shadow-lg animate-fade-up [animation-delay:600ms]">
        <span className="h-1.5 w-1.5 rounded-full bg-olive" />
        <span className="text-xs font-medium text-charcoal">Bez laktozy · dopasowano</span>
      </div>
    </div>
  );
}