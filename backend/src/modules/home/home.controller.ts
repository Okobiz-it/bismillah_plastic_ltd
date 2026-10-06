import type { Request, Response, NextFunction } from 'express';
import { HomeBanner } from './home.model.js';
import { sendResponse } from '../../core/utils/response.js';
import cloudinary from '../../core/config/cloudinary.js';

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

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HomeBanner.find().sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let imageUrl = req.body.imageUrl;
    const singleFile = req.file;

    if (singleFile) {
      imageUrl = await uploadToCloudinary(singleFile.buffer, 'maple_ag_global/home_banners');
    }

    if (!imageUrl) {
      return sendResponse(res, 400, null, 'Image is required');
    }

    const banner = await HomeBanner.create({ imageUrl, isActive: true });
    sendResponse(res, 201, banner, 'Banner created successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const banner = await HomeBanner.findByIdAndDelete(id);
    if (!banner) return sendResponse(res, 404, null, 'Banner not found');
    sendResponse(res, 200, null, 'Banner deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateBannersOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { banners } = req.body;
        if (Array.isArray(banners)) {
            for (const b of banners) {
                await HomeBanner.findByIdAndUpdate(b._id, { order: b.order });
            }
        }
        sendResponse(res, 200, null, 'Order updated');
    } catch (error) {
        next(error);
    }
};

export const toggleBannerActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const banner = await HomeBanner.findById(id);
        if (!banner) return sendResponse(res, 404, null, 'Banner not found');
        
        banner.isActive = !banner.isActive;
        await banner.save();
        
        sendResponse(res, 200, banner, 'Banner status updated');
    } catch (error) {
        next(error);
    }
};

// keep getAll for fallback if it was used anywhere
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HomeBanner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};
