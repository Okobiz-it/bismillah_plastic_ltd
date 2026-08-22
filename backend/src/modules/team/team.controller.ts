import type { Request, Response, NextFunction } from 'express';
import { Team } from './team.model.js';
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

const optimizeAndUploadImage = async (buffer: Buffer, folder = 'maple_ag_global/team'): Promise<string> => {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  return uploadToCloudinary(processedBuffer, folder);
};

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await Team.find();
    sendResponse(res, 200, team);
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }
    const member = await Team.create(data);
    sendResponse(res, 201, member);
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = await optimizeAndUploadImage(req.file.buffer);
    }
    const member = await Team.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    if (!member) {
      sendError(res, 404, 'Team member not found');
      return;
    }
    sendResponse(res, 200, member);
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const member = await Team.findByIdAndDelete(id);
    if (!member) {
      sendError(res, 404, 'Team member not found');
      return;
    }
    sendResponse(res, 200, { message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
