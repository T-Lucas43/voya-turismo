"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="hero-media"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <video
        className="hero-video"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-balneario-voya-4k.webp"
      >
        <source src="/media/hero-balneario-voya-4k.webm" type="video/webm" />
      </video>
    </motion.div>
  );
}
