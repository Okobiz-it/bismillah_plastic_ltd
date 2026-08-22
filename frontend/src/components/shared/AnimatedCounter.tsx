"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number | string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  let targetNumber = 0;
  let displaySuffix = suffix;
  let rawStringValue: string | null = null;

  if (typeof value === "number") {
    targetNumber = value;
  } else if (typeof value === "string") {
    const cleanStr = value.trim();
    const match = cleanStr.match(/^([\d.,]+)\s*(.*)$/);
    if (match && match[1]) {
      const parsedNum = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsedNum)) {
        targetNumber = parsedNum;
        if (!suffix && match[2]) {
          displaySuffix = match[2];
        }
      } else {
        rawStringValue = cleanStr;
      }
    } else {
      rawStringValue = cleanStr;
    }
  }

  const [displayValue, setDisplayValue] = useState<number | null>(rawStringValue !== null ? null : 0);

  useEffect(() => {
    if (!isInView || rawStringValue !== null) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * targetNumber));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, targetNumber, duration, rawStringValue]);

  return (
    <motion.span
      ref={ref}
      className={`font-serif font-bold tabular-nums ${className || "text-current"}`}
    >
      {rawStringValue !== null
        ? rawStringValue + suffix
        : (displayValue ?? targetNumber).toLocaleString() + displaySuffix}
    </motion.span>
  );
}

