import { motion } from "motion/react";
import React from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  const isLeft = align === "left";
  return (
    <div className={`mb-12 md:mb-16 ${isLeft ? "max-w-2xl text-left" : "max-w-2xl mx-auto text-center"}`}>
      {eyebrow && (
        <p
          className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-3 font-mono ${
            inverted ? "text-amber-300" : "text-[#0E335C]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight ${
          inverted ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-3.5 text-sm sm:text-base leading-relaxed ${
            inverted ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
