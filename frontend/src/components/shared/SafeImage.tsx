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

const LEGACY_URL_REPLACEMENTS: Record<string, string> = {
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514994/factory-sorting_t3y7kp.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/v1787231528/factory_iamge_bxnjhs.jpg",
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/plastic-flakes_w4iunf.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-cXTuIajikM_pkzl8e.jpg",
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514996/port-hero_qvfoo7.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto/v1786514996/cargo-ship_qffeko.jpg",
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514997/sustainability-hero_m1k9vb.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg",
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514994/factory-hero_t5w6re.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/f_auto,q_auto/v1787229103/hero-facility_cluoha.jpg",
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514994/lab-testing_x8j2qa.jpg":
    "https://res.cloudinary.com/wpttnkjq/image/upload/v1787230580/www.beatsnoop.com-3000-zWBaYXgP7h_ypqeah.jpg",
};

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
    const cleanSrc = inputSrc.trim();
    if (LEGACY_URL_REPLACEMENTS[cleanSrc]) {
      return LEGACY_URL_REPLACEMENTS[cleanSrc];
    }
    return cleanSrc;
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
