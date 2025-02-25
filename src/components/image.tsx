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
  image: {
    imageUrl: string;
    url: string;
    name: string;
  };
  index: number;
  bottomRowIndices: number[];
  setSelectedPhoto: (index: number) => void;
}) {
  const [processedImage, setProcessedImage] =
    useState<ImageWithDimensions | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update the URL generation function to handle paths more robustly
  const getImageUrl = (url: string, width = 800) => {
    try {
      // If it's already a full URL, extract just the filename
      const filename = url.includes("/") ? url.split("/").pop() || url : url;
      const encodedPath = encodeURIComponent(filename);
      return `/api/images/${encodedPath}?width=${width}&quality=85`;
    } catch (e) {
      console.error("Error formatting image URL:", e);
      return url; // Fallback to original URL
    }
  };

  const formattedImage = {
    ...image,
    url: image.imageUrl || getImageUrl(image.url),
  };

  useEffect(() => {
    const loadImageDimensions = async () => {
      const loadImage = () =>
        new Promise<ImageWithDimensions>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              ...formattedImage,
              width: img.width,
              height: img.height,
              aspectRatio: img.width > img.height ? "landscape" : "portrait",
            });
          };
          img.src = formattedImage.url;
        });

      const processedImage = await loadImage();
      setProcessedImage(processedImage);
    };

    loadImageDimensions();
  }, [formattedImage]);

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
          src={processedImage.url}
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
