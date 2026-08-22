/**
 * Utility for optimizing Cloudinary and dynamic image URLs
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  crop?: string;
}

export function getOptimizedCloudinaryUrl(url?: string | null, options: CloudinaryOptions = {}): string {
  if (!url || typeof url !== 'string') return '';
  
  // Only process valid Cloudinary URLs
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  // Do not format SVGs
  if (url.toLowerCase().endsWith('.svg')) {
    return url;
  }

  // If already has transformation parameters in upload segment, don't duplicate
  if (url.includes('/upload/f_auto') || url.includes('/upload/w_')) {
    return url;
  }

  const { width, height, quality = 'auto', format = 'auto', crop = 'limit' } = options;
  
  const transformations: string[] = [];
  if (format) transformations.push(`f_${format}`);
  if (quality) transformations.push(`q_${quality}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  const transformString = transformations.join(',');

  // Insert after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}
