"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import NextImage from "@/components/image";
import { imageSortOrder } from "@/data/sortOrder";
import useBreakpoint from "@/hooks/useBreakpoints";
import { openSpring } from "@/lib/motion-presets";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

type Image = {
  name: string;
  url: string;
  imageUrl: string;
  width?: number;
  height?: number;
};

interface PhotoRow {
  photos: Image[];
  rowHeight: number;
}

export default function ImageGrid() {
  const [photos, setPhotos] = useState<Image[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(-1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBelowMd } = useBreakpoint("md");

  // Auto-detect container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width !== containerWidth) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerWidth]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/images`);
        const data = await response?.json();
        const photos: Image[] = data.images;

        setPhotos(photos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const sortedPhotos = useMemo(() => {
    return imageSortOrder
      ? [...photos].sort((a, b) => {
          // Find the first sort order item that contains the image name
          const aIndex = imageSortOrder.findIndex(
            (sortItem) =>
              a.name.toLowerCase().includes(sortItem.toLowerCase()) ||
              sortItem.toLowerCase().includes(a.name.toLowerCase())
          );
          const bIndex = imageSortOrder.findIndex(
            (sortItem) =>
              b.name.toLowerCase().includes(sortItem.toLowerCase()) ||
              sortItem.toLowerCase().includes(b.name.toLowerCase())
          );

          // If both items are in sortOrder, sort by their position
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only a is in sortOrder, it comes first
          if (aIndex !== -1) return -1;
          // If only b is in sortOrder, it comes first
          if (bIndex !== -1) return 1;
          // If neither is in sortOrder, maintain original order
          return 0;
        })
      : photos;
  }, [photos]);

  // Calculate rows with optimal heights
  const rows = useMemo(() => {
    if (containerWidth === 0 || sortedPhotos.length === 0) return [];

    const targetRowHeight = isBelowMd ? 300 : 250; // Increased from 200 to 300 for mobile
    const gap = isBelowMd ? 4 : 8; // Smaller gap on mobile for bigger images
    const rows: PhotoRow[] = [];
    let currentRow: Image[] = [];
    let currentRowAspectSum = 0;

    for (const photo of sortedPhotos) {
      // Use provided dimensions or default aspect ratio
      const aspectRatio =
        photo.width && photo.height ? photo.width / photo.height : 1.5; // Default aspect ratio

      currentRow.push(photo);
      currentRowAspectSum += aspectRatio;

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

    // Handle the last row
    if (currentRow.length > 0) {
      const rowHeight = targetRowHeight;
      rows.push({ photos: currentRow, rowHeight });
    }

    return rows;
  }, [sortedPhotos, containerWidth, isBelowMd]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPhoto(-1);
    }
  };

  const selectedImage = selectedPhoto > -1 ? sortedPhotos[selectedPhoto] : null;

  const getImageUrl = (url: string, width = 800) => {
    try {
      // If it's already a Cloudinary URL, add transformations
      if (url.includes("res.cloudinary.com")) {
        const baseUrl = url.split("/").slice(0, -1).join("/");
        const filename = url.split("/").pop() || "";
        return `${baseUrl}/w_${width},q_85,f_webp,c_fill/${filename}`;
      }

      // If it's a public_id, use our API
      const encodedPath = encodeURIComponent(url);
      return `/api/images/${encodedPath}?width=${width}&quality=85`;
    } catch (e) {
      console.error("Error formatting image URL:", e);
      return url; // Fallback to original URL
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {/* Loading skeleton - show 3 rows with varying numbers of items */}
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
          <div className="flex flex-col gap-2">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 md:gap-2">
                {row.photos.map((photo) => {
                  const photoIndex = sortedPhotos.findIndex(
                    (p) => p.name === photo.name
                  );
                  const isActive = selectedPhoto === photoIndex;
                  const aspectRatio =
                    photo.width && photo.height
                      ? photo.width / photo.height
                      : 1.5;
                  const imgWidth = row.rowHeight * aspectRatio;

                  return (
                    <div
                      key={photo.name}
                      style={{
                        width: `${imgWidth}px`,
                        height: `${row.rowHeight}px`,
                      }}
                      className="relative overflow-hidden rounded-sm"
                    >
                      <NextImage
                        image={photo}
                        index={photoIndex}
                        isSelected={isActive}
                        setSelectedPhoto={setSelectedPhoto}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <Dialog
          open={true}
          onOpenChange={handleOpenChange}
          key="lightbox-dialog"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => handleOpenChange(false)}
          />
          <DialogContent
            className="bg-transparent border-none max-w-[90vw] max-h-[90vh] p-0 pointer-events-none [&>button]:pointer-events-auto [&>button]:z-[70] data-[state=open]:animate-none data-[state=closed]:animate-none z-[70]"
            onClick={(e) => handleOpenChange(false)}
          >
            <DialogTitle className="sr-only">{selectedImage.name}</DialogTitle>
            <div className="flex h-full w-full items-center justify-center pointer-events-none">
              <motion.img
                key={selectedImage.name}
                layoutId={`photo-${selectedPhoto}`}
                layout
                initial={false}
                src={
                  selectedImage.imageUrl || getImageUrl(selectedImage.url, 1600)
                }
                alt={selectedImage.name}
                className="pointer-events-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
                draggable={false}
                style={{ willChange: "transform" }}
                transition={{
                  layout: openSpring,
                }}
              />
            </div>
            <DialogDescription className="sr-only">
              {selectedImage.name}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
