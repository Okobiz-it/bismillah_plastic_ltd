import type { Request, Response, NextFunction } from 'express';
import { Country } from './countries.model.js';
import { sendResponse, sendError } from '../../core/utils/response.js';

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await Country.find();
    sendResponse(res, 200, countries);
  } catch (error) {
    next(error);
  }
};

export const createCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const country = await Country.create(req.body);
    sendResponse(res, 201, country);
  } catch (error) {
    next(error);
  }
};

export const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    if (!country) {
      sendError(res, 404, 'Country not found');
      return;
    }
    sendResponse(res, 200, country);
  } catch (error) {
    next(error);
  }
};

export const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      sendError(res, 404, 'Country not found');
      return;
    }
    sendResponse(res, 200, { message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
