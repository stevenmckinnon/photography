"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import NextImage from "@/components/image";
import { imageSortOrder } from "@/data/sortOrder";
import useBreakpoint from "@/hooks/useBreakpoints";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
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
      for (let entry of entries) {
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
            {[1, 2, 3].map((rowIndex) => {
              const targetRowHeight = isBelowMd ? 300 : 250;
              const gap = isBelowMd ? 4 : 8;
              const itemsInRow = rowIndex === 1 ? 3 : rowIndex === 2 ? 2 : 4;
              const itemWidth = containerWidth > 0 
                ? (containerWidth - gap * (itemsInRow - 1)) / itemsInRow 
                : isBelowMd ? 200 : 250;
              
              return (
                <div
                  key={rowIndex}
                  className="flex gap-2"
                  style={{ gap: isBelowMd ? "4px" : "8px" }}
                >
                  {Array.from({ length: itemsInRow }).map((_, itemIndex) => (
                    <Skeleton
                      key={itemIndex}
                      className="rounded-sm flex-1"
                      style={{
                        width: `${itemWidth}px`,
                        height: `${targetRowHeight}px`,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-2"
                style={{ gap: isBelowMd ? "4px" : "8px" }}
              >
                {row.photos.map((photo) => {
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
                        index={sortedPhotos.findIndex(
                          (p) => p.name === photo.name
                        )}
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

      <Dialog open={selectedPhoto > -1} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-transparent border-none max-w-[90vw] max-h-[90vh]">
          <DialogTitle className="sr-only">Photo</DialogTitle>
          <Carousel scrollTo={selectedPhoto}>
            <CarouselContent>
              {sortedPhotos.map((photo) => (
                <CarouselItem
                  key={photo.name}
                  className="flex items-center justify-center"
                >
                  <img
                    src={photo.imageUrl || getImageUrl(photo.url)}
                    alt={photo.name}
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <DialogDescription className="sr-only">
            {sortedPhotos?.[selectedPhoto]?.name}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
