import type { Request, Response, NextFunction } from 'express';
import { Category } from './categories.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/categories'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Category.find({}).sort({ name: 1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendResponse(res, 400, null, 'Category name is required');
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    if (!imageUrl) {
      return sendResponse(res, 400, null, 'Category image is required');
    }

    const category = await Category.create({ name, imageUrl, description });
    sendResponse(res, 201, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await Category.findById(id);
    if (!existing) {
      return sendResponse(res, 404, null, 'Category not found');
    }

    const updateData: any = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;

    if (req.file) {
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );
    
    sendResponse(res, 200, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return sendResponse(res, 404, null, 'Category not found');
    }
    sendResponse(res, 200, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
