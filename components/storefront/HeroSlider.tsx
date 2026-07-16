"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HERO_SLIDES, HeroSlide } from "@/lib/heroSlides";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const minSwipeDistance = 50;

  // Active Slides Filter
  const slides = HERO_SLIDES.filter((slide) => slide.isActive);

  // Autoplay Effect (6s delay)
  useEffect(() => {
    // Respect prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isPaused || slides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isPaused, slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  // Touch handlers for swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (slides.length === 0) return null;

  return (
    <section 
      className="relative overflow-hidden bg-ink-900 text-white min-h-[500px] lg:min-h-[600px] flex items-center group"
      role="region" 
      aria-label="Featured Products" 
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Injected style tag for pure custom float animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-glow {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,84,20,0.25), transparent 70%);
          filter: blur(40px);
          z-index: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hero-product-img {
          position: relative;
          z-index: 1;
          transform: rotate(-6deg);
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.5));
          animation: heroFloat 4s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50% { transform: rotate(-6deg) translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-product-img {
            animation: none !important;
            transform: rotate(-6deg) !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Global Glowing Spotlight Background Elements (Shared stage feel) */}
      <div className="absolute right-[-10%] top-1/4 h-[400px] w-[400px] rounded-full bg-brand-orange/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute left-1/4 bottom-10 h-[300px] w-[300px] rounded-full bg-[#FF7A33]/10 blur-[100px] pointer-events-none z-0" />

      {/* Slide Container Wrapper */}
      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 py-16 lg:py-24">
        <div className="relative min-h-[380px] lg:min-h-[420px]">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full transition-all duration-500 ease-out transform ${
                  isActive 
                    ? "opacity-100 translate-x-0 pointer-events-auto relative z-10" 
                    : "opacity-0 translate-x-5 pointer-events-none absolute inset-0 z-0"
                }`}
              >
                {/* Text Description Block */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  {slide.eyebrow && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-brand-orange/20 text-brand-orange tracking-widest uppercase">
                      {slide.eyebrow}
                    </span>
                  )}
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black leading-[1.05] tracking-tight">
                    {/* First line: Slightly muted white for high contrast */}
                    <span className="text-[#E5E5E5] block">{slide.headlineLine1}</span>
                    {slide.headlineLine2 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-light text-glow block mt-1">
                        {slide.headlineLine2}
                      </span>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base text-ink-400 leading-relaxed font-sans max-w-xl">
                    {slide.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={slide.primaryCta.href}
                      className="bg-brand-orange text-white hover:bg-brand-orange-light px-7 py-3.5 rounded-xl text-sm font-bold shadow-orange-glow transition-all duration-200"
                    >
                      {slide.primaryCta.label}
                    </Link>
                    {slide.secondaryCta && (
                      <Link
                        href={slide.secondaryCta.href}
                        className="border border-border/20 text-white hover:bg-white/5 hover:border-white/30 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Media Showcase Block */}
                <div className="lg:col-span-5 flex justify-center relative">
                  {/* Radial glow background aligned directly behind the image */}
                  <div className="hero-glow" />
                  
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 z-10 flex items-center justify-center">
                    {slide.type === "welcome" ? (
                      // Welcome Slide Graphic Silhouette
                      <div className="w-48 h-48 rounded-full border-2 border-brand-orange/30 bg-ink-900/60 flex items-center justify-center backdrop-blur-md relative animate-pulse shadow-premium">
                        <div className="w-36 h-36 rounded-full border border-brand-orange/20 bg-brand-orange/5 flex items-center justify-center">
                          <span className="text-xl font-display font-black text-brand-orange tracking-widest">YG</span>
                        </div>
                      </div>
                    ) : (
                      // Promo Slide Cutout + Float + Tilt styling
                      slide.image && (
                        <div className="hero-product-img w-full h-full pointer-events-none">
                          <Image
                            src={slide.image.src}
                            alt={slide.image.alt}
                            fill
                            priority
                            className="object-contain"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Left/Right Arrow Controls (visible on hover on desktop, always visible on mobile) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-ink-900/60 border border-border/10 text-white flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-all md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-ink-900/60 border border-border/10 text-white flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-all md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all border ${
                idx === activeIndex
                  ? "bg-brand-orange border-brand-orange scale-110"
                  : "bg-transparent border-border/40 hover:border-border/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Live Region for Accessibility Announcements */}
      <div className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}
      </div>
    </section>
  );
}
