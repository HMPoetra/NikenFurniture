"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";

type MediaItem = {
  id: number;
  url: string;
  fileType: "image" | "video";
  fileName?: string | null;
};

type PortfolioMediaShowcaseProps = {
  title: string;
  media: MediaItem[];
};

function MediaPreview({ item, title }: { item: MediaItem; title: string }) {
  if (item.fileType === "video") {
    return (
      <div className="relative h-full w-full">
        <video src={item.url} className="h-full w-full object-cover" controls playsInline />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={item.url}
        alt={item.fileName || title}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 68vw"
      />
    </div>
  );
}

export default function PortfolioMediaShowcase({ title, media }: PortfolioMediaShowcaseProps) {
  const validMedia = useMemo<MediaItem[]>(
    () =>
      media
        .map<MediaItem>((item) => ({
          id: item.id,
          url: String(item.url || "").trim(),
          fileType: item.fileType === "video" ? "video" : "image",
          fileName: item.fileName || null,
        }))
        .filter((item) => Boolean(item.url)),
    [media],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (validMedia.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % validMedia.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [validMedia.length]);

  useEffect(() => {
    if (zoomIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setZoomIndex((current) => (current === null ? current : (current + 1) % validMedia.length));
      }

      if (event.key === "ArrowLeft") {
        setZoomIndex((current) =>
          current === null ? current : (current - 1 + validMedia.length) % validMedia.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [validMedia.length, zoomIndex]);

  if (validMedia.length === 0) {
    return null;
  }

  const activeMedia = validMedia[activeIndex];
  const zoomMedia = zoomIndex === null ? null : validMedia[zoomIndex];
  const zoomDisplayIndex = zoomIndex === null ? 1 : zoomIndex + 1;

  const prev = () => setActiveIndex((current) => (current - 1 + validMedia.length) % validMedia.length);
  const next = () => setActiveIndex((current) => (current + 1) % validMedia.length);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Visual Proyek</h2>
            <p className="mt-1 text-sm text-slate-500">Seluruh media proyek tampil dalam slider otomatis.</p>
          </div>
          <div className="hidden rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:inline-flex">
            {activeIndex + 1}/{validMedia.length}
          </div>
        </div>

        <div className="relative h-[360px] overflow-hidden bg-slate-950 sm:h-[460px] lg:h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMedia.id}-${activeIndex}`}
              initial={{ opacity: 0, x: 36, scale: 1.01 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -36, scale: 0.99 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              <MediaPreview item={activeMedia} title={title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 text-white backdrop-blur-md transition-all hover:bg-slate-950/55"
            aria-label="Media sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 text-white backdrop-blur-md transition-all hover:bg-slate-950/55"
            aria-label="Media berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {activeMedia.fileType === "image" && (
            <button
              type="button"
              onClick={() => setZoomIndex(activeIndex)}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
              Zoom
            </button>
          )}

        </div>

        {validMedia.length > 1 && (
          <div className="grid grid-cols-4 gap-2 border-t border-slate-100 p-4 sm:grid-cols-6 sm:p-5">
            {validMedia.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${item.id}-${item.url}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${isActive ? "border-primary-500 ring-2 ring-primary-200" : "border-slate-200 hover:border-slate-300"}`}
                  aria-label={`Pilih media ${index + 1}`}
                >
                  <div className="relative h-14 w-full sm:h-16">
                    {item.fileType === "video" ? (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                        Video
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`${title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="120px"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {zoomMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          onClick={() => setZoomIndex(null)}
        >
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomIndex(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              aria-label="Tutup zoom"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative min-h-[60vh] bg-black">
              {zoomMedia.fileType === "video" ? (
                <video src={zoomMedia.url} className="h-full w-full max-h-[80vh] object-contain" controls autoPlay />
              ) : (
                <div className="relative h-[70vh] w-full">
                  <Image
                    src={zoomMedia.url}
                    alt={zoomMedia.fileName || title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-white">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Media {zoomDisplayIndex}/{validMedia.length}</div>
                <div className="mt-1 text-sm text-white/80">{zoomMedia.fileType === "video" ? "Video" : "Foto"}</div>
              </div>

              {validMedia.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomIndex((current) => (current === null ? current : (current - 1 + validMedia.length) % validMedia.length))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    aria-label="Zoom sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomIndex((current) => (current === null ? current : (current + 1) % validMedia.length))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    aria-label="Zoom berikutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}