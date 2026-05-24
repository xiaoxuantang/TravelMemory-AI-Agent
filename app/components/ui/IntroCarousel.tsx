"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const slides = [
  {
    title: "上传旅行照片",
    text: "选择一张你喜欢的旅行照片，AI 会读取照片里的旅行情绪。"
  },
  {
    title: "生成旅行明信片",
    text: "自动生成标题、文案和一张适合分享的旅行记忆海报。"
  },
  {
    title: "下载并分享",
    text: "保存海报，分享给朋友，也可以通过二维码带来新的旅行记忆。"
  }
];

export function IntroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveIndex(Math.min(slides.length - 1, Math.max(0, nextIndex)));
  }

  return (
    <div className="tm-page min-h-screen justify-between">
      <div className="flex justify-end">
        <Link href="/upload" className="text-sm font-semibold text-tm-muted">
          跳过
        </Link>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {slides.map((slide) => (
          <section
            key={slide.title}
            className="min-w-full snap-center px-1"
          >
            <div className="tm-panel flex min-h-96 flex-col justify-center p-6 text-center">
              <p className="mb-4 text-sm font-medium text-tm-accent">
                TravelMemory
              </p>
              <h1 className="text-3xl font-bold text-tm-text">{slide.title}</h1>
              <p className="mt-4 text-base leading-7 text-tm-muted">
                {slide.text}
              </p>
            </div>
          </section>
        ))}
      </div>

      <div className="space-y-5">
        <div className="flex justify-center gap-2">
          {slides.map((slide, index) => (
            <span
              key={slide.title}
              className={
                index === activeIndex
                  ? "h-2 w-6 rounded-tm-pill bg-tm-primary"
                  : "h-2 w-2 rounded-tm-pill bg-tm-border"
              }
            />
          ))}
        </div>

        <Link href="/upload" className="tm-button-primary flex items-center justify-center">
          开始生成我的旅行记忆
        </Link>
      </div>
    </div>
  );
}
