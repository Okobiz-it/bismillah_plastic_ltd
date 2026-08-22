import type { Request, Response, NextFunction } from 'express';
import { Certification } from './certifications.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/certifications'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getCertifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certs = await Certification.find();
    sendResponse(res, 200, certs);
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }
    const cert = await Certification.create(data);
    sendResponse(res, 201, cert);
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }
    const cert = await Certification.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    if (!cert) {
      sendError(res, 404, 'Certification not found');
      return;
    }
    sendResponse(res, 200, cert);
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findByIdAndDelete(id);
    if (!cert) {
      sendError(res, 404, 'Certification not found');
      return;
    }
    sendResponse(res, 200, { message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
