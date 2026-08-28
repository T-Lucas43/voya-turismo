"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type HomePackageCarouselProps = {
  children: ReactNode;
  itemCount: number;
};

const AUTOPLAY_DELAY = 3200;
const INTERACTION_PAUSE = 7000;

export function HomePackageCarousel({ children, itemCount }: HomePackageCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || itemCount < 2) return;

    const mobileQuery = window.matchMedia("(max-width: 560px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let pauseUntil = 0;

    const stopTimer = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };

    const schedule = (delay = AUTOPLAY_DELAY) => {
      stopTimer();
      if (!mobileQuery.matches || reducedMotionQuery.matches) return;
      timer = window.setTimeout(advance, delay);
    };

    const advance = () => {
      if (document.hidden) {
        schedule();
        return;
      }

      const remainingPause = pauseUntil - Date.now();
      if (remainingPause > 0) {
        schedule(remainingPause);
        return;
      }

      const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".package-card"));
      const nextCard = cards.find((card) => card.offsetLeft > carousel.scrollLeft + 16);
      carousel.scrollTo({ left: nextCard?.offsetLeft ?? 0, behavior: "smooth" });
      schedule();
    };

    const pauseForInteraction = () => {
      pauseUntil = Date.now() + INTERACTION_PAUSE;
      schedule(INTERACTION_PAUSE);
    };

    const handlePreferenceChange = () => schedule();
    carousel.addEventListener("pointerdown", pauseForInteraction, { passive: true });
    carousel.addEventListener("focusin", pauseForInteraction);
    mobileQuery.addEventListener("change", handlePreferenceChange);
    reducedMotionQuery.addEventListener("change", handlePreferenceChange);
    schedule();

    return () => {
      stopTimer();
      carousel.removeEventListener("pointerdown", pauseForInteraction);
      carousel.removeEventListener("focusin", pauseForInteraction);
      mobileQuery.removeEventListener("change", handlePreferenceChange);
      reducedMotionQuery.removeEventListener("change", handlePreferenceChange);
    };
  }, [itemCount]);

  return <div ref={carouselRef} className="package-grid home-package-grid" role="region" aria-roledescription="carrossel" aria-label="Pacotes em destaque com rolagem automática no celular">{children}</div>;
}
