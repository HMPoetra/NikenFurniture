"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";

type ServiceMediaItem = {
  url: string;
  mediaType: "image" | "video";
  fileName?: string | null;
};

type ServiceMediaSliderProps = {
  title: string;
  media: ServiceMediaItem[];
};

export default function ServiceMediaSlider({ title, media }: ServiceMediaSliderProps) {
  const validMedia = useMemo(
    () =>
      media
        .map((item) => ({
          url: String(item?.url || "").trim(),
          mediaType: item?.mediaType === "video" ? "video" : "image",
          fileName: item?.fileName || null,
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
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Galeri Proyek</h2>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 text-sm">
          Belum ada gambar galeri untuk layanan ini.
        </div>
      </div>
    );
  }

  const prev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? validMedia.length - 1 : prevIndex - 1,
    );
  };

  const next = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === validMedia.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const zoomMedia = zoomIndex === null ? null : validMedia[zoomIndex];
  const zoomDisplayIndex = zoomIndex === null ? 1 : zoomIndex + 1;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-3xl font-bold text-slate-900">Galeri Proyek</h2>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {activeIndex + 1}/{validMedia.length}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${validMedia[activeIndex].url}-${activeIndex}`}
            initial={{ opacity: 0, x: 30, scale: 1.01 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {validMedia[activeIndex].mediaType === "video" ? (
              <video
                src={validMedia[activeIndex].url}
                className="h-[260px] w-full object-cover md:h-[420px]"
                controls
              />
            ) : (
              <img
                src={validMedia[activeIndex].url}
                alt={`${title} - gambar ${activeIndex + 1}`}
                className="h-[260px] w-full object-cover md:h-[420px]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/services/default.svg";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setZoomIndex(activeIndex)}
          className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/20"
          aria-label="Perbesar media"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Zoom
        </button>

        {validMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {validMedia.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {validMedia.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${item.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-lg border transition-all ${
                  isActive ? "border-primary-500 ring-2 ring-primary-200" : "border-slate-200 hover:border-slate-300"
                }`}
                aria-label={`Pilih media ${index + 1}`}
              >
                {item.mediaType === "video" ? (
                  <div className="flex h-14 w-full items-center justify-center bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    Video
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`${title} thumbnail ${index + 1}`}
                    className="h-14 w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/services/default.svg";
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

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
              {zoomMedia.mediaType === "video" ? (
                <video src={zoomMedia.url} className="h-full w-full max-h-[80vh] object-contain" controls autoPlay />
              ) : (
                <img
                  src={zoomMedia.url}
                  alt={zoomMedia.fileName || title}
                  className="h-[70vh] w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/services/default.svg";
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-white">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Media {zoomDisplayIndex}/{validMedia.length}</div>
                <div className="mt-1 text-sm text-white/80 inline-flex items-center gap-1.5">
                  {zoomMedia.mediaType === "video" && <Play className="h-3.5 w-3.5" />}
                  {zoomMedia.mediaType === "video" ? "Video" : "Foto"}
                </div>
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
