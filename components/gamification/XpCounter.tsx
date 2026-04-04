"use client";

import { LazyMotion, domAnimation, m, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  from: number;
  to: number;
  duration?: number;
}

function AnimatedNumber({ from, to, duration = 1.2 }: Props) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v: number) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, to, duration]);

  return <m.span>{rounded}</m.span>;
}

export default function XpCounter({ from, to, duration }: Props) {
  return (
    <LazyMotion features={domAnimation}>
      <span className="tabular-nums font-bold text-brand-600">
        <AnimatedNumber from={from} to={to} duration={duration} />
        <span className="ml-1 text-sm font-semibold text-brand-400">XP</span>
      </span>
    </LazyMotion>
  );
}
