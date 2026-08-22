"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { IMAGES } from "@/constants/images";
import { getOptimizedCloudinaryUrl } from "@/lib/images";

interface SafeImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  useNextImage?: boolean;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = IMAGES.PLACEHOLDER,
  useNextImage = false,
  className,
  sizes,
  quality = 80,
  fill,
  ...props
}: SafeImageProps) {
  const getValidSrc = (inputSrc?: string | null) => {
    if (
      !inputSrc ||
      typeof inputSrc !== "string" ||
      inputSrc.trim() === "" ||
      inputSrc === "null" ||
      inputSrc === "undefined"
    ) {
      return fallbackSrc;
    }
    return inputSrc;
  };

  const [imgSrc, setImgSrc] = useState<string>(() => getValidSrc(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(getValidSrc(src));
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  if (useNextImage) {
    const computedSizes = sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined);

    return (
      <Image
        {...props}
        key={imgSrc}
        fill={fill}
        src={imgSrc}
        alt={alt || "Image"}
        className={className}
        onError={handleError}
        sizes={computedSizes}
        quality={quality}
        unoptimized={hasError || props.unoptimized}
      />
    );
  }

  // NextImage props may contain layout, fill, sizes which are invalid for standard <img>, 
  // so we selectively pass valid standard HTML image attributes
  const { width, height, loading = "lazy", style, title, onClick, onLoad } = props;
  const optimizedSrc = getOptimizedCloudinaryUrl(imgSrc, {
    width: typeof width === "number" ? width : undefined,
    height: typeof height === "number" ? height : undefined,
  });

  return (
    <img
      src={optimizedSrc}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      onLoad={onLoad}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      style={style}
      title={title}
      onClick={onClick}
    />
  );
}
