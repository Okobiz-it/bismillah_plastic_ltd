import type { Request, Response, NextFunction } from 'express';
import { RawMaterial } from './raw-materials.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/raw-materials'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1000, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.published === 'true') {
      filter.isPublished = true;
    }
    const data = await RawMaterial.find(filter).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createRawMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, isPublished, order } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    // Auto-set order to end of list if not provided
    let finalOrder = order !== undefined ? Number(order) : 0;
    if (!order && order !== 0) {
      const count = await RawMaterial.countDocuments();
      finalOrder = count;
    }

    const rawMaterial = await RawMaterial.create({
      name,
      description: description || '',
      imageUrl: imageUrl || 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg',
      order: finalOrder,
      isPublished: isPublished !== undefined ? String(isPublished) === 'true' : true,
    });

    sendResponse(res, 201, rawMaterial, 'Raw material created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRawMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, isPublished, order } = req.body;

    const existing = await RawMaterial.findById(id);
    if (!existing) {
      return sendResponse(res, 404, null, 'Raw material not found');
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublished !== undefined) updateData.isPublished = String(isPublished) === 'true';
    if (order !== undefined) updateData.order = Number(order);

    if (req.file) {
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const rawMaterial = await RawMaterial.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    sendResponse(res, 200, rawMaterial, 'Raw material updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRawMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const rawMaterial = await RawMaterial.findByIdAndDelete(id);
    if (!rawMaterial) {
      return sendResponse(res, 404, null, 'Raw material not found');
    }
    sendResponse(res, 200, null, 'Raw material deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const reorderRawMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body; // Array of { _id, order }
    if (!Array.isArray(items)) {
      return sendResponse(res, 400, null, 'Items array is required');
    }

    const bulkOps = items.map((item: { _id: string; order: number }) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await RawMaterial.bulkWrite(bulkOps);
    const data = await RawMaterial.find({}).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, data, 'Order updated successfully');
  } catch (error) {
    next(error);
  }
};
