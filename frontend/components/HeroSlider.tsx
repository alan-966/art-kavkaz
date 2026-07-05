"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/api";
import type { HeroSlide } from "@/lib/types";

const AUTOPLAY_MS = 6500;

function SlidePanel({ slide }: { slide: HeroSlide }) {
  const dark = slide.theme === "dark";
  const imageUrl = mediaUrl(slide.image?.url);

  return (
    <div className="relative h-[calc(100dvh-var(--header-height,180px))] w-full flex-none overflow-hidden">
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill priority className="object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: dark
                ? "linear-gradient(125deg,#163a5a 0%,#27628f 70%)"
                : "linear-gradient(120deg,#cedef1 0%,#b4cae3 68%)",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dark
              ? "linear-gradient(90deg,rgba(15,32,52,.82) 0%,rgba(15,32,52,.35) 52%,rgba(15,32,52,.1) 100%)"
              : "linear-gradient(90deg,rgba(236,245,254,.94) 0%,rgba(236,245,254,.6) 46%,rgba(236,245,254,.28) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dark
              ? "linear-gradient(0deg,rgba(13,28,46,.82) 0%,rgba(13,28,46,0) 42%)"
              : "linear-gradient(0deg,rgba(236,245,254,.95) 0%,rgba(236,245,254,0) 40%)",
          }}
        />
      </div>

      <div className="relative z-[2] flex h-full w-full max-w-[1320px] flex-col justify-end px-[clamp(20px,4vw,48px)] pb-[clamp(132px,17vh,196px)] mx-auto">
        <h1
          className={`m-0 line-clamp-2 font-display text-[clamp(32px,6.5vw,96px)] font-medium uppercase leading-[0.96] tracking-[-0.01em] ${
            dark ? "text-[#f4f9ff]" : "text-ink-strong"
          }`}
        >
          {slide.title}
        </h1>
        {slide.description && (
          <p
            className={`mt-7 line-clamp-2 max-w-[620px] text-[clamp(16px,1.9vw,24px)] font-light leading-[1.6] ${
              dark ? "text-[#d4e4f4]" : "text-[#33455b]"
            }`}
          >
            {slide.description}
          </p>
        )}
        {slide.button_text && slide.button_page && (
          <div className="mt-9">
            <Link
              href={slide.button_page.url}
              className={`inline-flex items-center gap-3 border px-8 py-[17px] text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                dark
                  ? "border-surface-tint bg-surface-tint text-navy hover:bg-transparent hover:text-surface-tint"
                  : "border-blue bg-blue text-surface-tint hover:bg-transparent hover:text-navy"
              }`}
            >
              {slide.button_text} <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const SWIPE_THRESHOLD_PX = 50;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  const dark = slides[index].theme === "dark";
  const width = containerRef.current?.clientWidth || 1;
  const dragPercent = (dragOffset / width) * 100;

  return (
    <section
      ref={containerRef}
      className="relative h-[calc(100dvh-var(--header-height,180px))] overflow-hidden bg-surface-mist"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setPaused(true);
        setDragging(true);
      }}
      onTouchMove={(e) => {
        if (touchStartX.current === null) return;
        setDragOffset(e.touches[0].clientX - touchStartX.current);
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) go(index + (delta < 0 ? 1 : -1));
        touchStartX.current = null;
        setDragging(false);
        setDragOffset(0);
        setPaused(false);
      }}
    >
      <div
        className={`flex h-full w-full ease-[cubic-bezier(0.7,0,0.18,1)] ${
          dragging ? "duration-0" : "transition-transform duration-[850ms]"
        }`}
        style={{ transform: `translateX(calc(-${index * 100}% + ${dragPercent}%))` }}
      >
        {slides.map((slide, i) => (
          <SlidePanel key={i} slide={slide} />
        ))}
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Назад"
        className={`absolute left-[clamp(14px,3vw,40px)] top-1/2 z-[4] hidden h-[54px] w-[54px] -translate-y-1/2 items-center justify-center border text-xl backdrop-blur-md transition-colors duration-300 sm:flex ${
          dark ? "border-white/40 bg-white/[0.14] text-white" : "border-blue/40 bg-blue/10 text-navy"
        }`}
      >
        ‹
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Вперёд"
        className={`absolute right-[clamp(14px,3vw,40px)] top-1/2 z-[4] hidden h-[54px] w-[54px] -translate-y-1/2 items-center justify-center border text-xl backdrop-blur-md transition-colors duration-300 sm:flex ${
          dark ? "border-white/40 bg-white/[0.14] text-white" : "border-blue/40 bg-blue/10 text-navy"
        }`}
      >
        ›
      </button>

      <div className="absolute inset-x-0 bottom-[clamp(30px,5vh,52px)] z-[4] mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-6 px-[clamp(20px,4vw,48px)]">
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Баннер ${i + 1}`}
              className="h-2 border-none transition-all duration-300"
              style={{
                width: i === index ? 30 : 8,
                background: i === index ? "#f54f1d" : dark ? "rgba(255,255,255,.35)" : "rgba(46,111,158,.3)",
              }}
            />
          ))}
        </div>
        <div
          className={`font-mono text-xs tracking-[0.18em] ${dark ? "text-[#a9cdec]" : "text-muted"}`}
        >
          {String(index + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(count).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
