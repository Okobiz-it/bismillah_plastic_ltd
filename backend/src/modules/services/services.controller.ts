import type { Request, Response, NextFunction } from 'express';
import { ServiceStat, ServiceHeader, ServicePartner, ServiceCategoryItem } from './services.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/services'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

type PageCategory = 'quality' | 'manufacturing' | 'sustainability' | 'global-export';

interface StatSeed {
  category: PageCategory;
  value: string;
  label: string;
}

interface HeaderSeed {
  category: PageCategory;
  headline: string;
  description: string;
}

interface CategoryItemSeed {
  category: PageCategory;
  title: string;
  imageUrl: string;
}

const INITIAL_STATS: StatSeed[] = [
  // Quality
  { category: 'quality', value: '99%', label: 'Material Purity' },
  { category: 'quality', value: '100%', label: 'Batch Testing' },
  { category: 'quality', value: '<1%', label: 'Moisture Content' },
  // Manufacturing
  { category: 'manufacturing', value: '[CAPACITY]', label: 'Monthly Production' },
  { category: 'manufacturing', value: '9', label: 'Process Steps' },
  { category: 'manufacturing', value: '24/7', label: 'Operations' },
  // Global Export
  { category: 'global-export', value: '[COUNT]', label: 'Export Destinations' },
  { category: 'global-export', value: '[VOLUME]', label: 'Tons Exported Annually' },
  { category: 'global-export', value: 'FOB/CIF', label: 'Shipping Terms' },
];

const INITIAL_HEADERS: HeaderSeed[] = [
  {
    category: 'quality',
    headline: 'Quality You Can Specify. Supply You Can Trust.',
    description: 'Every batch of recycled plastic material undergoes rigorous quality control — from raw material inspection through final packaging. Our testing ensures consistent material specifications that meet international manufacturing standards.'
  },
  {
    category: 'manufacturing',
    headline: 'From Plastic Waste to Premium Raw Material',
    description: 'Our multi-stage manufacturing process transforms post-consumer plastic waste into high-quality recycled chips and flakes ready for industrial use. Each step is designed for maximum yield, consistent quality, and minimal environmental impact.'
  },
  {
    category: 'sustainability',
    headline: 'Recycling Today for a Sustainable Tomorrow',
    description: 'By transforming plastic waste into reusable raw materials, we contribute to the circular economy — reducing landfill waste, conserving virgin resources, and supporting manufacturers who choose sustainable supply chains.'
  },
  {
    category: 'global-export',
    headline: 'Manufactured in Bangladesh. Exported Worldwide.',
    description: 'From our factory to Chattogram Port and onward to international destinations — we handle the complete export logistics chain, ensuring reliable delivery of recycled plastic materials to manufacturers across the globe.'
  }
];

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await ServiceStat.find({}).sort({ createdAt: 1 });
    if (data.length === 0) {
      data = await ServiceStat.insertMany(INITIAL_STATS);
    }
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getHeaders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await ServiceHeader.find({});
    if (data.length === 0) {
      data = await ServiceHeader.insertMany(INITIAL_HEADERS);
    }
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const updateHeader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const { headline, description } = req.body;

    if (!headline || !description) {
      return sendResponse(res, 400, null, 'Headline and description are required');
    }

    const header = await ServiceHeader.findOneAndUpdate(
      { category: category as any },
      { headline, description },
      { returnDocument: 'after', upsert: true }
    );

    sendResponse(res, 200, header, 'Section header updated successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, value, label } = req.body;
    if (!category || !value || !label) {
      return sendResponse(res, 400, null, 'Category, value, and label are required');
    }

    const existingCount = await ServiceStat.countDocuments({ category });
    if (existingCount >= 4) {
      return sendResponse(res, 400, null, `Maximum 4 stats allowed for ${category} category`);
    }

    const newStat = await ServiceStat.create({ category, value, label });
    sendResponse(res, 201, newStat, 'Service stat created successfully');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { category, value, label } = req.body;

    const stat = await ServiceStat.findById(id);
    if (!stat) {
      return sendResponse(res, 404, null, 'Service stat not found');
    }

    if (category && category !== stat.category) {
      const existingCount = await ServiceStat.countDocuments({ category });
      if (existingCount >= 4) {
        return sendResponse(res, 400, null, `Maximum 4 stats allowed for ${category} category`);
      }
      stat.category = category;
    }

    if (value !== undefined) stat.value = value;
    if (label !== undefined) stat.label = label;

    await stat.save();
    sendResponse(res, 200, stat, 'Service stat updated successfully');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const stat = await ServiceStat.findByIdAndDelete(id);
    if (!stat) {
      return sendResponse(res, 404, null, 'Service stat not found');
    }
    sendResponse(res, 200, null, 'Service stat deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ServicePartner.find({}).sort({ createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createPartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, name } = req.body;
    
    if (!category || !name) {
      return sendResponse(res, 400, null, 'Category and name are required');
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await optimizeAndUploadImage(req.file.buffer);
    } else {
      return sendResponse(res, 400, null, 'Image is required');
    }

    const partner = await ServicePartner.create({ category, name, imageUrl });
    sendResponse(res, 201, partner);
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { category, name } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    
    if (req.file) {
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const partner = await ServicePartner.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!partner) {
      return sendResponse(res, 404, null, 'Partner not found');
    }
    sendResponse(res, 200, partner);
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const partner = await ServicePartner.findByIdAndDelete(id);
    if (!partner) {
      return sendResponse(res, 404, null, 'Partner not found');
    }
    sendResponse(res, 200, { message: 'Partner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const INITIAL_CATEGORY_ITEMS: CategoryItemSeed[] = [
  // Quality
  { category: 'quality', title: 'Raw Material Inspection', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'quality', title: 'Contamination Testing', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'quality', title: 'Batch Analysis', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  // Manufacturing
  { category: 'manufacturing', title: 'Sorting & Crushing', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'manufacturing', title: 'Washing & Separation', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'manufacturing', title: 'Drying & Packaging', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  // Global Export
  { category: 'global-export', title: 'Container Loading', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'global-export', title: 'Port Operations', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
  { category: 'global-export', title: 'International Shipping', imageUrl: 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg' },
];

export const getCategoryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await ServiceCategoryItem.find({}).sort({ createdAt: 1 });
    if (data.length === 0) {
      data = await ServiceCategoryItem.insertMany(INITIAL_CATEGORY_ITEMS);
    }
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createCategoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, title } = req.body;
    
    if (!category || !title) {
      return sendResponse(res, 400, null, 'Category and title are required');
    }

    const existingCount = await ServiceCategoryItem.countDocuments({ category });
    if (existingCount >= 6) {
      return sendResponse(res, 400, null, `Maximum 6 category items allowed for ${category} category`);
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await optimizeAndUploadImage(req.file.buffer);
    } else {
      return sendResponse(res, 400, null, 'Image is required');
    }

    const item = await ServiceCategoryItem.create({ category, title, imageUrl });
    sendResponse(res, 201, item);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { category, title } = req.body;
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    
    if (req.file) {
      updateData.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }

    const item = await ServiceCategoryItem.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!item) {
      return sendResponse(res, 404, null, 'Category item not found');
    }
    sendResponse(res, 200, item);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await ServiceCategoryItem.findByIdAndDelete(id);
    if (!item) {
      return sendResponse(res, 404, null, 'Category item not found');
    }
    sendResponse(res, 200, { message: 'Category item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

