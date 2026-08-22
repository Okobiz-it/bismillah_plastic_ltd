import type { Request, Response, NextFunction } from 'express';
import { ContactInfo } from './contact.model.js';
import { sendResponse } from '../../core/utils/response.js';

export const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data = await ContactInfo.findOne();
    if (!data) {
      // Return empty default structure if none exists
      data = new ContactInfo();
    }
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ContactInfo.findOneAndUpdate(
      {}, // Empty filter matches the first document
      req.body,
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );
    sendResponse(res, 200, data);
  } catch (error) {
    next(error);
  }
};
