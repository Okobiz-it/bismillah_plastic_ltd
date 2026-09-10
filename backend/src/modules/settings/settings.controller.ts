import type { Request, Response, NextFunction } from 'express';
import { Settings } from './settings.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/settings'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const settings = await Settings.findOne({ key });
    if (!settings) {
      sendError(res, 404, 'Settings not found');
      return;
    }
    sendResponse(res, 200, settings.value);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const value = req.body; // value can be an object

    // If a file is uploaded (like a logo), merge it into the body
    if (req.file) {
      value.logoUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const settings = await Settings.findOneAndUpdate(
      { key },
      { value },
      { returnDocument: 'after', upsert: true }
    );
    sendResponse(res, 200, settings.value);
  } catch (error) {
    next(error);
  }
};

export const uploadSettingsImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      sendError(res, 400, 'No image file provided');
      return;
    }
    const imageUrl = await optimizeAndUploadImage(req.file.buffer, 'bismillah_plastic/impact');
    sendResponse(res, 200, { imageUrl });
  } catch (error) {
    next(error);
  }
};
