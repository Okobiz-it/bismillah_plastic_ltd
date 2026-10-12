import type { Request, Response, NextFunction } from 'express';
import { PageBanner } from './page-banner.model.js';
import { PAGE_BANNER_DEFAULTS, normalizePageKey } from './page-banner.defaults.js';
import { sendResponse, sendError } from '../../core/utils/response.js';
import cloudinary from '../../core/config/cloudinary.js';
import sharp from 'sharp';

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

const optimizeAndUploadBanner = async (
  buffer: Buffer,
  folder = 'bismillah_plastic/page_banners'
): Promise<string> => {
  try {
    const processedBuffer = await sharp(buffer)
      .rotate()
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88, effort: 4 })
      .toBuffer();
    return await uploadToCloudinary(processedBuffer, folder);
  } catch {
    // If sharp processing encounters an edge case, safely upload original buffer
    return await uploadToCloudinary(buffer, folder);
  }
};

const extractPageParam = (req: Request): string => {
  const category = Array.isArray(req.params.category) ? req.params.category.join('/') : req.params.category;
  const page = Array.isArray(req.params.page) ? req.params.page.join('/') : req.params.page;
  let raw = '';
  if (category && page) {
    raw = `${category}/${page}`;
  } else if (page) {
    raw = page;
  } else if (req.query.page && typeof req.query.page === 'string') {
    raw = req.query.page;
  }
  return normalizePageKey(raw);
};

export const getPageBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageKey = extractPageParam(req);
    if (!pageKey) {
      sendError(res, 400, 'Page identifier is required');
      return;
    }

    const defaultData = PAGE_BANNER_DEFAULTS[pageKey] || {
      page: pageKey,
      pageName: pageKey,
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
    };

    const banner = await PageBanner.findOne({ page: pageKey });
    if (!banner) {
      sendResponse(res, 200, {
        ...defaultData,
        isCustom: false,
      });
      return;
    }

    sendResponse(res, 200, {
      ...defaultData,
      ...banner.toObject(),
      // If custom record has empty fields, keep default fallback
      title: banner.title || defaultData.title,
      subtitle: banner.subtitle || defaultData.subtitle,
      description: banner.description || defaultData.description,
      imageUrl: banner.imageUrl || defaultData.imageUrl,
      isCustom: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPageBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customBanners = await PageBanner.find();
    const bannerMap = new Map(customBanners.map((b) => [b.page, b.toObject()]));

    const result = Object.entries(PAGE_BANNER_DEFAULTS).map(([key, def]) => {
      const custom = bannerMap.get(key);
      if (custom) {
        return {
          ...def,
          ...custom,
          title: custom.title || def.title,
          subtitle: custom.subtitle || def.subtitle,
          description: custom.description || def.description,
          imageUrl: custom.imageUrl || def.imageUrl,
          isCustom: true,
        };
      }
      return {
        ...def,
        isCustom: false,
      };
    });

    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

export const upsertPageBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageKey = extractPageParam(req);
    if (!pageKey) {
      sendError(res, 400, 'Page identifier is required');
      return;
    }

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = await optimizeAndUploadBanner(req.file.buffer);
    }

    const updateFields: Record<string, any> = {
      page: pageKey,
    };

    if (imageUrl !== undefined && imageUrl !== null) {
      updateFields.imageUrl = imageUrl;
    }
    if (req.body.title !== undefined) {
      updateFields.title = req.body.title;
    }
    if (req.body.subtitle !== undefined) {
      updateFields.subtitle = req.body.subtitle;
    }
    if (req.body.description !== undefined) {
      updateFields.description = req.body.description;
    }
    if (req.body.isActive !== undefined) {
      updateFields.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    const updated = await PageBanner.findOneAndUpdate(
      { page: pageKey },
      { $set: updateFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const defaultData = PAGE_BANNER_DEFAULTS[pageKey] || {
      page: pageKey,
      pageName: pageKey,
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
    };

    sendResponse(
      res,
      200,
      {
        ...defaultData,
        ...updated.toObject(),
        title: updated.title || defaultData.title,
        subtitle: updated.subtitle || defaultData.subtitle,
        description: updated.description || defaultData.description,
        imageUrl: updated.imageUrl || defaultData.imageUrl,
        isCustom: true,
      },
      'Page banner updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const deletePageBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageKey = extractPageParam(req);
    if (!pageKey) {
      sendError(res, 400, 'Page identifier is required');
      return;
    }

    await PageBanner.findOneAndDelete({ page: pageKey });

    const defaultData = PAGE_BANNER_DEFAULTS[pageKey] || {
      page: pageKey,
      pageName: pageKey,
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
    };

    sendResponse(
      res,
      200,
      {
        ...defaultData,
        isCustom: false,
      },
      'Page banner reset to default successfully'
    );
  } catch (error) {
    next(error);
  }
};
