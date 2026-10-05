import type { Request, Response, NextFunction } from 'express';
import { PhotoItem, VideoItem, PhotoCategoryType, VideoCategoryType } from './media.model.js';
import { Settings } from '../settings/settings.model.js';
import { sendResponse, sendError } from '../../core/utils/response.js';
import cloudinary from '../../core/config/cloudinary.js';
import sharp from 'sharp';
import fs from 'fs';

export const getCloudinaryAssetInfo = (url?: string): { publicId: string; resourceType: 'image' | 'video' | 'raw' } | null => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const isVideo = url.includes('/video/upload/');
    const isImage = url.includes('/image/upload/');
    const resourceType: 'image' | 'video' | 'raw' = isVideo ? 'video' : 'image';
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + '/upload/'.length).split('?')[0].split('#')[0];
    const segments = pathAfterUpload.split('/');
    const versionIndex = segments.findIndex(seg => /^v\d+$/.test(seg));
    let publicIdWithExt: string;
    if (versionIndex !== -1) {
      publicIdWithExt = segments.slice(versionIndex + 1).join('/');
    } else {
      const nonTransformIndex = segments.findIndex(seg => !seg.includes(',') && !/^[a-z]_/.test(seg));
      publicIdWithExt = nonTransformIndex !== -1 ? segments.slice(nonTransformIndex).join('/') : segments.join('/');
    }
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    return { publicId, resourceType };
  } catch (err) {
    console.error('Error parsing Cloudinary URL:', err);
    return null;
  }
};

export const deleteAssetFromCloudinary = async (
  url?: string,
  preferredResourceType?: 'image' | 'video' | 'raw'
): Promise<boolean> => {
  if (!url) return false;
  const assetInfo = getCloudinaryAssetInfo(url);
  if (!assetInfo || !assetInfo.publicId) {
    return false;
  }

  const resourceType = preferredResourceType || assetInfo.resourceType || 'image';
  try {
    const result = await cloudinary.uploader.destroy(assetInfo.publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    console.log(`Cloudinary destroy for ${assetInfo.publicId} (${resourceType}):`, result);
    return result.result === 'ok' || result.result === 'not found';
  } catch (err) {
    console.warn(`Failed to destroy Cloudinary asset ${assetInfo.publicId}:`, err);
    return false;
  }
};

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'bismillah_plastic/media'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

const uploadVideoToCloudinary = (
  fileSource: string | Buffer,
  folder = 'bismillah_plastic/videos'
): Promise<{ secure_url: string; duration?: number }> => {
  return new Promise((resolve, reject) => {
    if (typeof fileSource === 'string') {
      cloudinary.uploader.upload_large(
        fileSource,
        {
          folder,
          resource_type: 'video',
          chunk_size: 20 * 1024 * 1024, // 20MB chunking for large video files up to 1GB
          quality: 'auto:good',
          video_codec: 'auto',
          fetch_format: 'auto',
          eager: [{ quality: 'auto', format: 'mp4', video_codec: 'auto' }],
          eager_async: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            let url = result!.secure_url;
            if (url && url.includes('/upload/') && !url.includes('/upload/q_auto')) {
              url = url.replace('/upload/', '/upload/q_auto,f_auto/');
            }
            resolve({ secure_url: url, duration: result!.duration });
          }
        }
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'video',
          chunk_size: 20 * 1024 * 1024,
          quality: 'auto:good',
          video_codec: 'auto',
          fetch_format: 'auto',
          eager: [{ quality: 'auto', format: 'mp4', video_codec: 'auto' }],
          eager_async: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            let url = result!.secure_url;
            if (url && url.includes('/upload/') && !url.includes('/upload/q_auto')) {
              url = url.replace('/upload/', '/upload/q_auto,f_auto/');
            }
            resolve({ secure_url: url, duration: result!.duration });
          }
        }
      );
      uploadStream.end(fileSource);
    }
  });
};

export const formatSecondsToDuration = (seconds?: number): string => {
  if (!seconds || isNaN(seconds)) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Initial default seeds for photos
const INITIAL_PHOTOS = [
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg',
    caption: 'Unit 1 (Chawliapotti) Mechanical Recycling & Granulation Floor',
    category: 'plant-processing' as PhotoCategoryType,
    order: 1,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787229103/hero-facility_cluoha.jpg',
    caption: 'Dual Hot-Wash & Cold-Wash Decontamination System',
    category: 'plant-processing' as PhotoCategoryType,
    order: 2,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514997/import-machinery_r2eu3j.jpg',
    caption: 'Unit 2 (Damail) Industrial Crushers & Centrifugal Dryers',
    category: 'plant-processing' as PhotoCategoryType,
    order: 3,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787633415/www.beatsnoop.com-3000-MJzN4BhWpk_xq8vlp.jpg',
    caption: 'Decentralized Collection Center in Dinajpur Overseen by Women-Led Manager',
    category: 'community-empowerment' as PhotoCategoryType,
    order: 4,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787230422/www.beatsnoop.com-3000-YVZXGzd9UQ_bs8n0t.jpg',
    caption: 'Paddle-Van Logistics Network Transitioning Informal Waste Collectors',
    category: 'community-empowerment' as PhotoCategoryType,
    order: 5,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg',
    caption: 'Mandatory PPE Protocols and Occupational Health & Safety (OHS) Drill',
    category: 'safety-training' as PhotoCategoryType,
    order: 6,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787230273/management-banner_zq6nlm.jpg',
    caption: 'Worker Welfare Workshop & On-Site First-Aid Facility Inspection',
    category: 'safety-training' as PhotoCategoryType,
    order: 7,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787633413/www.beatsnoop.com-3000-cXTuIajikM_pkzl8e.jpg',
    caption: 'High-Purity Hot-Washed PET Flakes Packaged for Downstream Spinning Mills',
    category: 'circularity-recovery' as PhotoCategoryType,
    order: 8,
  },
  {
    imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787230335/www.beatsnoop.com-3000-dg68Te34ty_vfohh2.jpg',
    caption: 'Multi-Polymer Recovery Stream: Intercepted HDPE, LDPE & Multi-Layer Sachets',
    category: 'circularity-recovery' as PhotoCategoryType,
    order: 9,
  },
];

// Initial default seeds for videos
const INITIAL_VIDEOS = [
  {
    title: 'B2B Facility Walkthrough: Mechanical Recycling at Unit 1 & Unit 2',
    description: 'A comprehensive technical tour detailing industrial crushers, hot and cold washing, optical separation, and packaging of recycled plastic flakes.',
    category: 'operational-walkthrough' as VideoCategoryType,
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787229904/www.beatsnoop.com-3000-9kZPl3OjxS_mtz7rj.jpg',
    duration: '4:18',
    order: 1,
  },
  {
    title: 'Dual-Stage Washing & Purity Verification Pipeline',
    description: 'Examining the caustic hot-wash and ambient cold-wash techniques used to strip adhesives, labels, and organic impurities to meet international export specifications.',
    category: 'operational-walkthrough' as VideoCategoryType,
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    thumbnailUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787229103/hero-facility_cluoha.jpg',
    duration: '3:45',
    order: 2,
  },
  {
    title: 'Empowering Grassroots Leadership: 30 Women-Led Collection Centers',
    description: 'Documentary vignette profiling female center managers in Dinajpur leading community aggregation, financial autonomy, and fair-wage livelihoods.',
    category: 'impact-stories' as VideoCategoryType,
    videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    thumbnailUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787633415/www.beatsnoop.com-3000-MJzN4BhWpk_xq8vlp.jpg',
    duration: '5:12',
    order: 3,
  },
  {
    title: 'Formalizing the Informal: Waste Pickers to Safe Supply Chain Partners',
    description: 'Stories of paddle-van drivers and community collectors entering safe, structured employment backed by PPE, healthcare, and equal opportunity frameworks.',
    category: 'impact-stories' as VideoCategoryType,
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1787633414/www.beatsnoop.com-3000-H7qxWhOneT_pru67a.jpg',
    duration: '3:50',
    order: 4,
  },
];

// ============================================================================
// PHOTOS HANDLERS
// ============================================================================

export const getPhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const seedMarker = await Settings.findOne({ key: 'media_photos_initialized' });
    if (!seedMarker) {
      const count = await PhotoItem.countDocuments({});
      if (count === 0) {
        await PhotoItem.insertMany(INITIAL_PHOTOS);
      }
      await Settings.findOneAndUpdate(
        { key: 'media_photos_initialized' },
        { key: 'media_photos_initialized', value: true },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const filter = category ? { category: category as PhotoCategoryType } : {};
    const photos = await PhotoItem.find(filter).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, photos);
  } catch (error) {
    next(error);
  }
};

export const addPhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category = 'plant-processing', caption = '' } = req.body;
    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

    const existingCount = await PhotoItem.countDocuments({});
    const createdItems = [];
    let currentOrder = existingCount;

    // Handle files uploaded via multer
    if (files && files.length > 0) {
      for (const file of files) {
        const imageUrl = await optimizeAndUploadImage(file.buffer);
        const item = await PhotoItem.create({
          imageUrl,
          caption,
          category,
          order: ++currentOrder,
        });
        createdItems.push(item);
      }
    } else if (req.body.imageUrl) {
      // Direct URL provided
      const item = await PhotoItem.create({
        imageUrl: req.body.imageUrl,
        caption,
        category,
        order: ++currentOrder,
      });
      createdItems.push(item);
    } else {
      return sendError(res, 400, 'No image file or URL provided');
    }

    sendResponse(res, 201, createdItems, 'Photo(s) added successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { caption, category } = req.body;

    const existing = await PhotoItem.findById(id);
    if (!existing) {
      return sendError(res, 404, 'Photo not found');
    }

    const updateData: any = {};
    if (caption !== undefined) updateData.caption = caption;
    if (category) updateData.category = category;

    if (req.file) {
      if (existing.imageUrl) {
        await deleteAssetFromCloudinary(existing.imageUrl, 'image');
      }
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const item = await PhotoItem.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    sendResponse(res, 200, item, 'Photo updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await PhotoItem.findById(id);
    if (!item) {
      return sendError(res, 404, 'Photo not found');
    }

    // Permanently destroy image asset from Cloudinary
    if (item.imageUrl) {
      await deleteAssetFromCloudinary(item.imageUrl, 'image');
    }

    await PhotoItem.findByIdAndDelete(id);
    sendResponse(res, 200, null, 'Photo deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const reorderPhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 400, 'ids must be a non-empty array of IDs');
    }

    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));
    await PhotoItem.bulkWrite(bulkOps);
    const updated = await PhotoItem.find({}).sort({ order: 1 });
    sendResponse(res, 200, updated, 'Photos reordered successfully');
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// VIDEOS HANDLERS
// ============================================================================

export const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const seedMarker = await Settings.findOne({ key: 'media_videos_initialized' });
    if (!seedMarker) {
      const count = await VideoItem.countDocuments({});
      if (count === 0) {
        await VideoItem.insertMany(INITIAL_VIDEOS);
      }
      await Settings.findOneAndUpdate(
        { key: 'media_videos_initialized' },
        { key: 'media_videos_initialized', value: true },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const filter = category ? { category: category as VideoCategoryType } : {};
    const videos = await VideoItem.find(filter).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, videos);
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description = '', category = 'operational-walkthrough', videoUrl, duration = '' } = req.body;

    if (!title || !videoUrl) {
      return sendError(res, 400, 'Title and Video URL are required');
    }

    let thumbnailUrl = req.body.thumbnailUrl || '';
    if (req.file) {
      thumbnailUrl = await optimizeAndUploadImage(req.file.buffer, 'bismillah_plastic/video_thumbs');
    }

    // If no thumbnail provided and it's a YouTube URL, extract standard YouTube thumb
    if (!thumbnailUrl && videoUrl) {
      const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && ytMatch[1]) {
        thumbnailUrl = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
    }

    const count = await VideoItem.countDocuments({});
    const video = await VideoItem.create({
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      duration,
      order: count + 1,
    });

    sendResponse(res, 201, video, 'Video added successfully');
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, category, videoUrl, duration } = req.body;

    const existing = await VideoItem.findById(id);
    if (!existing) {
      return sendError(res, 404, 'Video not found');
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (videoUrl !== undefined) {
      if (existing.videoUrl && existing.videoUrl !== videoUrl) {
        await deleteAssetFromCloudinary(existing.videoUrl, 'video');
      }
      updateData.videoUrl = videoUrl;
    }
    if (duration !== undefined) updateData.duration = duration;
    if (req.body.thumbnailUrl !== undefined) updateData.thumbnailUrl = req.body.thumbnailUrl;

    if (req.file) {
      if (existing.thumbnailUrl) {
        await deleteAssetFromCloudinary(existing.thumbnailUrl, 'image');
      }
      updateData.thumbnailUrl = await optimizeAndUploadImage(req.file.buffer, 'bismillah_plastic/video_thumbs');
    }

    const video = await VideoItem.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    sendResponse(res, 200, video, 'Video updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const video = await VideoItem.findById(id);
    if (!video) {
      return sendError(res, 404, 'Video not found');
    }

    // Delete video asset from Cloudinary if hosted on Cloudinary
    if (video.videoUrl) {
      await deleteAssetFromCloudinary(video.videoUrl, 'video');
    }

    // Delete thumbnail from Cloudinary if hosted on Cloudinary
    if (video.thumbnailUrl) {
      await deleteAssetFromCloudinary(video.thumbnailUrl, 'image');
    }

    await VideoItem.findByIdAndDelete(id);
    sendResponse(res, 200, null, 'Video deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const reorderVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 400, 'ids must be a non-empty array of IDs');
    }

    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));
    await VideoItem.bulkWrite(bulkOps);
    const updated = await VideoItem.find({}).sort({ order: 1 });
    sendResponse(res, 200, updated, 'Videos reordered successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadVideoAsset = async (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return sendError(res, 400, 'No video file uploaded');
    }
    const fileSource = filePath || req.file.buffer;
    if (!fileSource) {
      return sendError(res, 400, 'Invalid video file payload');
    }

    const { secure_url, duration } = await uploadVideoToCloudinary(fileSource);
    const formattedDuration = formatSecondsToDuration(duration);
    sendResponse(
      res,
      200,
      {
        videoUrl: secure_url,
        duration: formattedDuration,
        rawDuration: duration,
      },
      'Video compressed, optimized and uploaded to Cloudinary successfully'
    );
  } catch (error) {
    next(error);
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn('Failed to clean up temp video file:', cleanupErr);
      }
    }
  }
};
