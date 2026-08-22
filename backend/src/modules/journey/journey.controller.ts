import type { Request, Response, NextFunction } from 'express';
import { Journey } from './journey.model.js';
import { sendResponse } from '../../core/utils/response.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Journey.find({}).sort({ stepNo: 1, year: 1 });
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const createJourney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stepNo, year, subject, description } = req.body;
    
    const journey = await Journey.create({ stepNo, year, subject, description });
    sendResponse(res, 201, journey);
  } catch (error) {
    next(error);
  }
};

export const updateJourney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { stepNo, year, subject, description } = req.body;
    
    const updateData = { stepNo, year, subject, description };

    const journey = await Journey.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!journey) {
      return sendResponse(res, 404, null, 'Journey not found');
    }
    sendResponse(res, 200, journey);
  } catch (error) {
    next(error);
  }
};

export const deleteJourney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const journey = await Journey.findByIdAndDelete(id);
    if (!journey) {
      return sendResponse(res, 404, null, 'Journey not found');
    }
    sendResponse(res, 200, { message: 'Journey deleted successfully' });
  } catch (error) {
    next(error);
  }
};
