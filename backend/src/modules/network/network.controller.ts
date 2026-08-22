import type { Request, Response, NextFunction } from 'express';
import { NetworkCategory } from './network.model.js';
import { InfrastructureItem } from './infrastructure.model.js';
import cloudinary from '../../core/config/cloudinary.js';
import sharp from 'sharp';
import { sendResponse } from '../../core/utils/response.js';

// Seed initial categories if they don't exist
const seedCategories = async () => {
  const defaultCategories: Array<'Export' | 'Import' | 'Supply'> = ['Export', 'Import', 'Supply'];
  for (const name of defaultCategories) {
    const exists = await NetworkCategory.findOne({ name: name as any });
    if (!exists) {
      await NetworkCategory.create({ name, mapImage: '', countries: [] });
    }
  }
};

export const getNetwork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await seedCategories();
    const categories = await NetworkCategory.find();
    sendResponse(res, 200, categories);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryMap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName } = req.params;
    
    if (!req.file) {
      return sendResponse(res, 400, null, 'No map image uploaded');
    }

    const processedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'maple_ag_global/network_maps', resource_type: 'image' },
      async (error, result) => {
        if (error) return next(error);
        
        const category = await NetworkCategory.findOneAndUpdate(
          { name: categoryName as any },
          { mapImage: result!.secure_url },
          { returnDocument: 'after', runValidators: true }
        );
        
        if (!category) return sendResponse(res, 404, null, 'Category not found');
        sendResponse(res, 200, category, 'Category map updated successfully');
      }
    );
    uploadStream.end(processedBuffer);
  } catch (error) {
    next(error);
  }
};

export const addCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName } = req.params;
    const { name, region, keyProducts } = req.body;

    const category = await NetworkCategory.findOneAndUpdate(
      { name: categoryName as any },
      { $push: { countries: { name, region, keyProducts, markers: [] } } },
      { returnDocument: 'after', runValidators: true }
    );

    if (!category) return sendResponse(res, 404, null, 'Category not found');
    sendResponse(res, 201, category, 'Country added successfully');
  } catch (error) {
    next(error);
  }
};

export const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, countryId } = req.params;
    const { name, region, keyProducts } = req.body;

    const category = await NetworkCategory.findOneAndUpdate(
      { name: categoryName as any, 'countries._id': countryId },
      { 
        $set: { 
          'countries.$.name': name,
          'countries.$.region': region,
          'countries.$.keyProducts': keyProducts
        } 
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!category) return sendResponse(res, 404, null, 'Country or category not found');
    sendResponse(res, 200, category, 'Country updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, countryId } = req.params;

    const category = await NetworkCategory.findOneAndUpdate(
      { name: categoryName as any },
      { $pull: { countries: { _id: countryId } as any } },
      { returnDocument: 'after' }
    );

    if (!category) return sendResponse(res, 404, null, 'Category not found');
    sendResponse(res, 200, category, 'Country deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const addMarker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, countryId } = req.params;
    const { name, type, description, topProducts } = req.body;

    const category = await NetworkCategory.findOneAndUpdate(
      { name: categoryName as any, 'countries._id': countryId },
      { $push: { 'countries.$.markers': { name, type, description, topProducts } } as any },
      { returnDocument: 'after', runValidators: true }
    );

    if (!category) return sendResponse(res, 404, null, 'Country or category not found');
    sendResponse(res, 201, category, 'Marker added successfully');
  } catch (error) {
    next(error);
  }
};

export const updateMarker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, countryId, markerId } = req.params;
    const { name, type, description, topProducts } = req.body;

    // To update a nested array item in mongoose without array filters, we can fetch, modify, and save
    const category = await NetworkCategory.findOne({ name: categoryName as any });
    if (!category) return sendResponse(res, 404, null, 'Category not found');

    const country = category.countries.id(countryId as string);
    if (!country) return sendResponse(res, 404, null, 'Country not found');

    const marker = country.markers.id(markerId as string);
    if (!marker) return sendResponse(res, 404, null, 'Marker not found');

    marker.name = name;
    marker.type = type;
    marker.description = description;
    marker.topProducts = topProducts;

    await category.save();
    
    sendResponse(res, 200, category, 'Marker updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMarker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, countryId, markerId } = req.params;

    const category = await NetworkCategory.findOne({ name: categoryName as any });
    if (!category) return sendResponse(res, 404, null, 'Category not found');

    const country = category.countries.id(countryId as string);
    if (!country) return sendResponse(res, 404, null, 'Country not found');

    country.markers.pull({ _id: markerId });
    await category.save();

    sendResponse(res, 200, category, 'Marker deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Infrastructure & Logistics Gallery Handlers
// ==========================================

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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/infrastructure'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getInfrastructureGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await InfrastructureItem.find({}).sort({ order: 1, createdAt: 1 });
    sendResponse(res, 200, items);
  } catch (error) {
    next(error);
  }
};

export const addInfrastructureImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingCount = await InfrastructureItem.countDocuments({});

    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return sendResponse(res, 400, null, 'No image file uploaded');
    }

    const createdItems = [];
    let currentOrder = existingCount;

    for (const file of files) {
      const imageUrl = await optimizeAndUploadImage(file.buffer);
      const newItem = await InfrastructureItem.create({
        imageUrl,
        caption: req.body.caption || '',
        order: currentOrder++,
      });
      createdItems.push(newItem);
    }

    sendResponse(res, 201, createdItems, 'Infrastructure image(s) uploaded successfully');
  } catch (error) {
    next(error);
  }
};

export const updateInfrastructureItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await InfrastructureItem.findById(id);
    if (!item) {
      return sendResponse(res, 404, null, 'Gallery item not found');
    }

    if (req.file) {
      item.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    if (req.body.caption !== undefined) {
      item.caption = req.body.caption;
    }

    if (req.body.order !== undefined) {
      item.order = Number(req.body.order);
    }

    await item.save();
    sendResponse(res, 200, item, 'Gallery item updated successfully');
  } catch (error) {
    next(error);
  }
};

export const reorderInfrastructureItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return sendResponse(res, 400, null, 'Invalid request format. "ids" must be an array of string IDs.');
    }

    const bulkOps = ids.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { order: index },
      },
    }));

    if (bulkOps.length > 0) {
      await InfrastructureItem.bulkWrite(bulkOps);
    }

    const updatedItems = await InfrastructureItem.find({}).sort({ order: 1, createdAt: 1 });
    sendResponse(res, 200, updatedItems, 'Gallery items reordered successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteInfrastructureItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await InfrastructureItem.findByIdAndDelete(id);
    if (!item) {
      return sendResponse(res, 404, null, 'Gallery item not found');
    }

    sendResponse(res, 200, null, 'Gallery item deleted successfully');
  } catch (error) {
    next(error);
  }
};
