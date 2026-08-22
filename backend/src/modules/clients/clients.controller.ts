import type { Request, Response, NextFunction } from 'express';
import { Client } from './clients.model.js';
import { sendResponse } from '../../core/utils/response.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/clients'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Client.find({}).sort({ createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const client = await Client.create({ name, imageUrl });
    sendResponse(res, 201, client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const updateData: any = { name };
    if (req.file) {
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const client = await Client.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!client) {
      return sendResponse(res, 404, null, 'Client not found');
    }
    sendResponse(res, 200, client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return sendResponse(res, 404, null, 'Client not found');
    }
    sendResponse(res, 200, { message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};
