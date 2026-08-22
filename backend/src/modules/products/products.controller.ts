import type { Request, Response, NextFunction } from 'express';
import { Product } from './products.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/products'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1400, 1050, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    const data = await Product.find(filter).sort({ createdAt: -1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }
    sendResponse(res, 200, product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, description, category, origin, featured, imageUrl: bodyImageUrl,
      bodyImages,
      // Material fields
      materialType, color, processingType, chipSize, gradeQuality,
      // Technical specs
      technicalSpecs,
      // Commercial fields
      sku, moq, leadTime, stockStatus, packaging, paymentTerms, shippingTerms,
      // Supply fields
      monthlyProductionCapacity, availableCapacity,
      // Export & applications
      exportMarkets, applications, hsCode, certifications, specifications,
      // Documentation
      tdsUrl, catalogueUrl,
    } = req.body;

    const isFeatured = String(featured) === 'true';

    if (isFeatured) {
      const featuredCount = await Product.countDocuments({ featured: true });
      if (featuredCount >= 3) {
        return sendResponse(res, 400, null, 'Maximum 3 featured products allowed. Please unfeature another product first.');
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const singleFile = req.file;

    let imageUrl = '';
    if (Array.isArray(bodyImageUrl)) {
      imageUrl = bodyImageUrl.find((u) => typeof u === 'string' && u.trim()) || '';
    } else if (typeof bodyImageUrl === 'string') {
      imageUrl = bodyImageUrl;
    }
    const mainImageFile = files?.['image']?.[0] || singleFile;

    if (mainImageFile) {
      imageUrl = await optimizeAndUploadImage(mainImageFile.buffer);
    }

    if (!imageUrl) {
      imageUrl = 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg';
    }

    // Process additional gallery images if uploaded
    const galleryImageFiles = files?.['images'] || [];
    const galleryUrls: string[] = [];

    for (const file of galleryImageFiles) {
      const uploadedUrl = await optimizeAndUploadImage(file.buffer);
      galleryUrls.push(uploadedUrl);
    }

    // Combine with any existing image URLs provided in body
    let combinedImages: string[] = [];
    if (bodyImages) {
      try {
        const parsed = typeof bodyImages === 'string' ? JSON.parse(bodyImages) : bodyImages;
        if (Array.isArray(parsed)) combinedImages = parsed;
      } catch (_e) {
        // ignore parse error
      }
    }

    if ((!imageUrl || imageUrl.includes('placeholder_')) && galleryUrls.length > 0) {
      imageUrl = galleryUrls[0];
    }

    const finalImages = Array.from(new Set([imageUrl, ...combinedImages, ...galleryUrls])).filter(Boolean);

    // Parse technicalSpecs if JSON string
    const parsedTechnicalSpecs = technicalSpecs
      ? (typeof technicalSpecs === 'string' ? JSON.parse(technicalSpecs) : technicalSpecs)
      : undefined;

    const product = await Product.create({
      name, description, category,
      origin: origin || 'Bangladesh',
      featured: isFeatured,
      imageUrl, images: finalImages,
      // Material
      materialType, color, processingType, chipSize, gradeQuality,
      // Technical
      ...(parsedTechnicalSpecs && { technicalSpecs: parsedTechnicalSpecs }),
      // Commercial
      sku, moq, leadTime, stockStatus, packaging, paymentTerms, shippingTerms,
      // Supply
      monthlyProductionCapacity, availableCapacity,
      // Export
      exportMarkets, applications, hsCode, certifications, specifications,
      // Documentation
      tdsUrl, catalogueUrl,
    });

    sendResponse(res, 201, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      name, description, category, origin, featured, imageUrl: bodyImageUrl,
      bodyImages,
      materialType, color, processingType, chipSize, gradeQuality,
      technicalSpecs,
      sku, moq, leadTime, stockStatus, packaging, paymentTerms, shippingTerms,
      monthlyProductionCapacity, availableCapacity,
      exportMarkets, applications, hsCode, certifications, specifications,
      tdsUrl, catalogueUrl,
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    const isFeatured = featured !== undefined ? String(featured) === 'true' : existingProduct.featured;

    if (isFeatured) {
      const featuredCount = await Product.countDocuments({
        _id: { $ne: id },
        featured: true
      });
      if (featuredCount >= 3) {
        return sendResponse(res, 400, null, 'Maximum 3 featured products allowed. Please unfeature another product first.');
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (origin !== undefined) updateData.origin = origin;
    if (featured !== undefined) updateData.featured = isFeatured;

    // Material fields
    if (materialType !== undefined) updateData.materialType = materialType;
    if (color !== undefined) updateData.color = color;
    if (processingType !== undefined) updateData.processingType = processingType;
    if (chipSize !== undefined) updateData.chipSize = chipSize;
    if (gradeQuality !== undefined) updateData.gradeQuality = gradeQuality;

    // Technical specs
    if (technicalSpecs !== undefined) {
      updateData.technicalSpecs = typeof technicalSpecs === 'string' ? JSON.parse(technicalSpecs) : technicalSpecs;
    }

    // Commercial fields
    if (sku !== undefined) updateData.sku = sku;
    if (moq !== undefined) updateData.moq = moq;
    if (leadTime !== undefined) updateData.leadTime = leadTime;
    if (stockStatus !== undefined) updateData.stockStatus = stockStatus;
    if (packaging !== undefined) updateData.packaging = packaging;
    if (paymentTerms !== undefined) updateData.paymentTerms = paymentTerms;
    if (shippingTerms !== undefined) updateData.shippingTerms = shippingTerms;

    // Supply fields
    if (monthlyProductionCapacity !== undefined) updateData.monthlyProductionCapacity = monthlyProductionCapacity;
    if (availableCapacity !== undefined) updateData.availableCapacity = availableCapacity;

    // Export fields
    if (exportMarkets !== undefined) updateData.exportMarkets = exportMarkets;
    if (applications !== undefined) updateData.applications = applications;
    if (hsCode !== undefined) updateData.hsCode = hsCode;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (specifications !== undefined) updateData.specifications = specifications;

    // Documentation
    if (tdsUrl !== undefined) updateData.tdsUrl = tdsUrl;
    if (catalogueUrl !== undefined) updateData.catalogueUrl = catalogueUrl;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const singleFile = req.file;
    const mainImageFile = files?.['image']?.[0] || singleFile;

    // Process new uploaded images
    const galleryImageFiles = files?.['images'] || [];
    const galleryUrls: string[] = [];

    if (mainImageFile) {
      const uploadedMain = await optimizeAndUploadImage(mainImageFile.buffer);
      galleryUrls.push(uploadedMain);
    }

    for (const file of galleryImageFiles) {
      const uploadedUrl = await optimizeAndUploadImage(file.buffer);
      galleryUrls.push(uploadedUrl);
    }

    // Process retained existing images
    let existingImagesArray: string[] = [];
    if (bodyImages !== undefined) {
      try {
        const parsed = typeof bodyImages === 'string' ? JSON.parse(bodyImages) : bodyImages;
        if (Array.isArray(parsed)) {
          existingImagesArray = parsed.filter((u: any) => typeof u === 'string' && u.trim());
        }
      } catch (_e) {
        // ignore parse error
      }
    } else {
      existingImagesArray = existingProduct.images || (existingProduct.imageUrl ? [existingProduct.imageUrl] : []);
    }

    // Combine retained existing images + newly uploaded gallery URLs
    const finalImages = Array.from(new Set([...existingImagesArray, ...galleryUrls])).filter(Boolean);

    if (finalImages.length > 0) {
      updateData.images = finalImages;
      updateData.imageUrl = finalImages[0];
    } else if (bodyImageUrl && typeof bodyImageUrl === 'string' && bodyImageUrl.trim()) {
      updateData.imageUrl = bodyImageUrl.trim();
      updateData.images = [bodyImageUrl.trim()];
    } else {
      updateData.imageUrl = existingProduct.imageUrl || 'https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg';
      updateData.images = [updateData.imageUrl];
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    sendResponse(res, 200, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }
    sendResponse(res, 200, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
