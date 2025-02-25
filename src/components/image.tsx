"use client";
import { cn } from "@/lib/utils";
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Process the image URL to use our API
  const getOptimizedImageUrl = (url: string) => {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const path = urlObj.pathname.split("/").pop();

    // If we're in a development environment or can't extract the path, return original URL
    if (!path || process.env.NODE_ENV === "development") return url;

    // Determine appropriate width based on viewport
    const width = window.innerWidth < 768 ? 400 : 800;

    // Return the API URL
    return `/api/images/${path}?width=${width}&quality=85`;
  };

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
  }, [image]);

  if (!processedImage) {
    return (
      <li className="grow w-full h-[300px] animate-pulse bg-gray-100/10 rounded-sm" />
    );
  }

  return (
    <li
      key={processedImage.name}
      className={`grow w-full h-auto ${
        processedImage.aspectRatio === "landscape"
          ? "sm:h-[300px] sm:w-[400px]"
          : "sm:h-[300px] sm:w-[200px]"
      } ${bottomRowIndices.includes(index) ? "!grow-0" : ""}`}
    >
      <button
        onClick={() => setSelectedPhoto(index)}
        className="h-full w-full"
        aria-label={`View ${processedImage.name}`}
        role="button"
      >
        <img
          src={getOptimizedImageUrl(processedImage.url)}
          width={processedImage.width}
          height={processedImage.height}
          alt={processedImage.name}
          data-loaded={isLoaded}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "h-full w-full max-h-full min-w-full object-cover align-bottom hover:opacity-90 transition-opacity rounded-sm",
            "data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          )}
        />
      </button>
    </li>
  );
}
