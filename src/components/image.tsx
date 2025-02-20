"use client";
import { cn } from "@/lib/utils";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ImageWithDimensions {
  url: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: "landscape" | "portrait";
}

export default function Images({
  image,
  index,
  bottomRowIndices,
  setSelectedPhoto,
}: {
  image: { url: string; name: string };
  index: number;
  bottomRowIndices: number[];
  setSelectedPhoto: (index: number) => void;
}) {
  const [processedImage, setProcessedImage] =
    useState<ImageWithDimensions | null>(null);

  useEffect(() => {
    const loadImageDimensions = async () => {
      const loadImage = () =>
        new Promise<ImageWithDimensions>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              ...image,
              width: img.width,
              height: img.height,
              aspectRatio: img.width > img.height ? "landscape" : "portrait",
            });
          };
          img.src = image.url;
        });

      const processedImage = await loadImage();
      setProcessedImage(processedImage);
    };

    loadImageDimensions();
  }, []);

  if (!processedImage) return null;

  return (
    <li
      key={processedImage.name}
      className={`grow w-full h-auto ${
        processedImage.aspectRatio === "landscape"
          ? "sm:h-[300px] sm:w-[400px]"
          : "sm:h-[300px] sm:w-[200px]"
      } ${bottomRowIndices.includes(index) ? "!grow-0" : ""}`}
    >
      <button onClick={() => setSelectedPhoto(index)} className="h-full w-full">
        <NextImage
          src={processedImage.url}
          width={processedImage.width}
          height={processedImage.height}
          alt={processedImage.name}
          data-loaded="false"
          priority
          onLoad={(event) => {
            event.currentTarget.setAttribute("data-loaded", "true");
          }}
          className={cn(
            "h-full w-full max-h-full min-w-full object-cover align-bottom hover:opacity-90 transition-opacity rounded-sm",
            "data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          )}
        />
      </button>
    </li>
  );
}
