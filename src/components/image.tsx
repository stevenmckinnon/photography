"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";

import { closeSpring, openSpring } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface ImageWithDimensions {
  url: string;
  name: string;
  width: number;
  height: number;
  aspectRatio: "landscape" | "portrait";
}

interface ImageProps {
  image: {
    name: string;
    url: string;
    imageUrl: string;
    width?: number;
    height?: number;
  };
  index: number;
  setSelectedPhoto: (index: number) => void;
  onImageLoaded?: () => void;
  style?: React.CSSProperties;
  isSelected?: boolean;
}

export default function Images({
  image,
  index,
  setSelectedPhoto,
  onImageLoaded,
  style,
  isSelected = false,
}: ImageProps) {
  const [processedImage, setProcessedImage] =
    useState<ImageWithDimensions | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(image.imageUrl || "");

  // Function to get optimized image URL
  const getOptimizedImageUrl = useCallback((url: string, width = 500) => {
    try {
      // If it's already a Cloudinary URL, add transformations
      if (url.includes("res.cloudinary.com")) {
        const baseUrl = url.split("/").slice(0, -1).join("/");
        const filename = url.split("/").pop() || "";
        return `${baseUrl}/w_${width},q_80,f_webp,c_fill/${filename}`;
      }

      // If it's a public_id, use our API
      const encodedPath = encodeURIComponent(url);
      return `/api/images/${encodedPath}?width=${width}&quality=80`;
    } catch (e) {
      console.error("Error formatting image URL:", e);
      return url; // Fallback to original URL
    }
  }, []);

  useEffect(() => {
    const loadImageDimensions = async () => {
      const loadImage = () =>
        new Promise<ImageWithDimensions>((resolve, reject) => {
          const img = new Image();

          img.onload = () => {
            resolve({
              url: imageUrl,
              name: image.name,
              width: img.width,
              height: img.height,
              aspectRatio: img.width > img.height ? "landscape" : "portrait",
            });
            setIsLoaded(true);
          };

          img.onerror = () => {
            console.error(
              `Error loading image: ${image.name} from ${imageUrl}`
            );
            reject(new Error("Failed to load image"));
          };

          img.src = imageUrl;
        });

      try {
        const processedImage = await loadImage();
        setProcessedImage(processedImage);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    if (imageUrl) {
      loadImageDimensions();
    } else {
      // If no imageUrl is available, use our API
      setImageUrl(getOptimizedImageUrl(image.url));
    }
  }, [imageUrl, image.name, image.url, getOptimizedImageUrl]);

  // Add this to the onLoad handler
  const handleImageLoaded = () => {
    setIsLoaded(true);
    onImageLoaded?.(); // Call the callback when image loads
  };

  if (!processedImage) {
    return (
      <div className="w-full h-[300px] animate-pulse bg-gray-100/10 rounded-sm" />
    );
  }

  return (
    <button
      onClick={() => setSelectedPhoto(index)}
      className="w-full h-full"
      aria-label={`View ${processedImage.name}`}
      role="button"
    >
      <motion.img
        initial={false}
        layoutId={`photo-${index}`}
        layout
        src={processedImage.url}
        width={processedImage.width}
        height={processedImage.height}
        alt={processedImage.name}
        data-loaded={isLoaded}
        onLoad={handleImageLoaded}
        style={{ ...style, willChange: "transform" }}
        className={cn(
          "cursor-pointer w-full h-auto object-cover hover:opacity-90 transition-opacity rounded-sm",
          "data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
        )}
        transition={{
          layout: isSelected ? openSpring : closeSpring,
        }}
      />
    </button>
  );
}
