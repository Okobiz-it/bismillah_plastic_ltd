import type { Request, Response, NextFunction } from 'express';
import { HomeContent } from './home.model.js';
import { sendResponse } from '../../core/utils/response.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HomeContent.find({});
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

// Add create, update, delete here
