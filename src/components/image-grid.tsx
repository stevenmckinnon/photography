"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import NextImage from "@/components/image";
import { imageSortOrder } from "@/data/sortOrder";
import useBreakpoint from "@/hooks/useBreakpoints";
import { openSpring } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/gallery";

import { Dialog, DialogDescription, DialogTitle } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

interface PhotoRow {
  photos: GalleryImage[];
  rowHeight: number;
}

/** Images in the first row render eagerly so the grid paints without a gap. */
const EAGER_COUNT = 5;

export default function ImageGrid({ images }: { images: GalleryImage[] }) {
  const photos = images;
  const [selectedPhoto, setSelectedPhoto] = useState<number>(-1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBelowMd } = useBreakpoint("md");

  // Measure before the browser paints, so the grid doesn't flash empty for a
  // frame after hydration while waiting on the ResizeObserver callback.
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
  }, []);

  // Then keep it in sync with resizes.
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth((current) =>
          entry.contentRect.width === current ? current : entry.contentRect.width
        );
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const sortedPhotos = useMemo(() => {
    // Whole-name lookup. The previous substring match meant "…-Hils-15" also
    // matched the "…-Hils-1" entry and jumped to the front of the gallery.
    // Cloudinary rewrites spaces to underscores, so normalise both sides.
    const normalise = (name: string) =>
      name.toLowerCase().replace(/[\s_]+/g, "_");

    const rank = new Map<string, number>();
    imageSortOrder.forEach((name, index) => {
      const key = normalise(name);
      // First occurrence wins, so a duplicated entry can't demote an image.
      if (!rank.has(key)) rank.set(key, index);
    });

    return [...photos]
      .map((photo, index) => ({
        photo,
        // Unlisted photos keep their Cloudinary order, after the curated set.
        rank:
          rank.get(normalise(photo.name)) ?? imageSortOrder.length + index,
      }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ photo }) => photo);
  }, [photos]);

  // Calculate rows with optimal heights
  const rows = useMemo(() => {
    if (containerWidth === 0 || sortedPhotos.length === 0) return [];

    const targetRowHeight = isBelowMd ? 300 : 250;
    const gap = isBelowMd ? 4 : 8;
    const rows: PhotoRow[] = [];
    let currentRow: GalleryImage[] = [];
    let currentRowAspectSum = 0;

    const aspectOf = (photo: GalleryImage) =>
      photo.width && photo.height ? photo.width / photo.height : 1.5;

    for (const photo of sortedPhotos) {
      currentRow.push(photo);
      currentRowAspectSum += aspectOf(photo);

      const rowWidth =
        targetRowHeight * currentRowAspectSum + gap * (currentRow.length - 1);

      if (rowWidth >= containerWidth) {
        const rowHeight =
          (containerWidth - gap * (currentRow.length - 1)) /
          currentRowAspectSum;
        rows.push({ photos: currentRow, rowHeight });
        currentRow = [];
        currentRowAspectSum = 0;
      }
    }

    if (currentRow.length > 0) {
      const justify = (photos: GalleryImage[]) => {
        const aspectSum = photos.reduce((sum, p) => sum + aspectOf(p), 0);
        return (containerWidth - gap * (photos.length - 1)) / aspectSum;
      };

      const naturalWidth =
        targetRowHeight * currentRowAspectSum + gap * (currentRow.length - 1);

      if (naturalWidth > containerWidth) {
        // Enough to fill the row on its own.
        rows.push({ photos: currentRow, rowHeight: justify(currentRow) });
      } else if (currentRow.length === 1 && rows.length > 0) {
        // A single trailing image reads as a mistake. Fold it into the
        // previous row and re-justify them together.
        const previous = rows[rows.length - 1];
        const merged = [...previous.photos, ...currentRow];
        rows[rows.length - 1] = {
          photos: merged,
          rowHeight: justify(merged),
        };
      } else {
        // Short final row: match the row above so it reads as part of the grid.
        const previousRowHeight =
          rows[rows.length - 1]?.rowHeight ?? targetRowHeight;
        rows.push({
          photos: currentRow,
          rowHeight: Math.min(targetRowHeight, previousRowHeight),
        });
      }
    }

    return rows;
  }, [sortedPhotos, containerWidth, isBelowMd]);

  const isOpen = selectedPhoto > -1;
  const selectedImage = isOpen ? sortedPhotos[selectedPhoto] : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPhoto(-1);
    }
  };

  const step = useCallback(
    (delta: number) => {
      setSelectedPhoto((current) => {
        if (current < 0 || sortedPhotos.length === 0) return current;
        // Wrap so browsing never dead-ends.
        return (current + delta + sortedPhotos.length) % sortedPhotos.length;
      });
    },
    [sortedPhotos.length]
  );

  // Arrow-key navigation while the lightbox is open. Radix handles Escape.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, step]);

  // Warm the neighbouring full-size images so prev/next feels instant.
  useEffect(() => {
    if (!isOpen) return;

    for (const delta of [1, -1]) {
      const neighbour =
        sortedPhotos[
          (selectedPhoto + delta + sortedPhotos.length) % sortedPhotos.length
        ];
      if (neighbour) {
        const img = new window.Image();
        img.src = neighbour.fullUrl;
      }
    }
  }, [isOpen, selectedPhoto, sortedPhotos]);

  return (
    <>
      <div ref={containerRef} className="w-full">
        {photos.length === 0 ? (
          <p className="py-16 text-center font-body text-muted-foreground">
            The gallery is unavailable right now. Please try again shortly.
          </p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col gap-2">
            {/* Shown in the server HTML and until the container is measured. */}
            {[1, 2, 3].map((rowIndex) => (
              <div key={rowIndex} className="flex gap-1 md:gap-2">
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <Skeleton
                    key={itemIndex}
                    className="rounded-sm flex-1 md:hidden w-[250px] h-[280px]"
                  />
                ))}
                {Array.from({ length: 6 }).map((_, itemIndex) => (
                  <Skeleton
                    key={itemIndex}
                    className="rounded-sm flex-1 hidden md:block w-[250px] h-[200px]"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1 md:gap-2">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 md:gap-2">
                {row.photos.map((photo) => {
                  const photoIndex = sortedPhotos.indexOf(photo);
                  const isActive = selectedPhoto === photoIndex;
                  const aspectRatio =
                    photo.width && photo.height
                      ? photo.width / photo.height
                      : 1.5;
                  const imgWidth = row.rowHeight * aspectRatio;

                  return (
                    <motion.div
                      key={photo.name}
                      style={{
                        width: `${imgWidth}px`,
                        height: `${row.rowHeight}px`,
                        // Blur-up preview behind the image. Falls back to the
                        // muted fill below when no preview was generated.
                        backgroundImage: photo.blurDataURL
                          ? `url(${photo.blurDataURL})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className="relative overflow-hidden rounded-sm bg-muted/40"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                    >
                      <NextImage
                        image={photo}
                        index={photoIndex}
                        isSelected={isActive}
                        setSelectedPhoto={setSelectedPhoto}
                        sizes={`${Math.round(imgWidth)}px`}
                        priority={photoIndex < EAGER_COUNT}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogPrimitive.Portal forceMount>
          <AnimatePresence initial={false}>
            {isOpen && selectedImage && (
              <motion.div
                key="lightbox-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {isOpen && selectedImage && (
              <DialogPrimitive.Content
                key="lightbox-content"
                forceMount
                asChild
                onClick={() => handleOpenChange(false)}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4 focus:outline-none sm:p-8"
                >
                  <DialogTitle className="sr-only">
                    {selectedImage.caption ?? selectedImage.alt}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Photo {selectedPhoto + 1} of {sortedPhotos.length}. Use the
                    left and right arrow keys to browse.
                  </DialogDescription>

                  <motion.img
                    key={selectedImage.name}
                    layoutId={`photo-${selectedPhoto}`}
                    layout
                    initial={false}
                    src={selectedImage.fullUrl}
                    alt={selectedImage.alt}
                    className="max-h-[85vh] w-auto max-w-full object-contain"
                    draggable={false}
                    onClick={(event) => event.stopPropagation()}
                    style={{ willChange: "transform" }}
                    transition={{ layout: openSpring }}
                  />

                  <LightboxButton
                    label="Previous photo"
                    className="left-2 top-1/2 -translate-y-1/2 sm:left-4"
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft className="size-5" strokeWidth={1.5} />
                  </LightboxButton>

                  <LightboxButton
                    label="Next photo"
                    className="right-2 top-1/2 -translate-y-1/2 sm:right-4"
                    onClick={() => step(1)}
                  >
                    <ChevronRight className="size-5" strokeWidth={1.5} />
                  </LightboxButton>

                  <LightboxButton
                    label="Close"
                    className="right-2 top-4 sm:right-4"
                    onClick={() => handleOpenChange(false)}
                  >
                    <X className="size-5" strokeWidth={1.5} />
                  </LightboxButton>

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 px-4 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {selectedImage.caption && (
                      <p className="max-w-prose text-pretty text-sm text-white/80">
                        {selectedImage.caption}
                      </p>
                    )}
                    <p className="font-body text-xs tabular-nums text-white/50">
                      {selectedPhoto + 1} / {sortedPhotos.length}
                    </p>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            )}
          </AnimatePresence>
        </DialogPrimitive.Portal>
      </Dialog>
    </>
  );
}

function LightboxButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute z-[80] flex size-11 cursor-pointer items-center justify-center rounded-full",
        "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
        "transition-[background-color,scale] duration-150 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        "active:scale-[0.96] motion-reduce:active:scale-100",
        className
      )}
    >
      {children}
    </button>
  );
}
