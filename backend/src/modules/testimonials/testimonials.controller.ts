import type { Request, Response, NextFunction } from 'express';
import { Testimonial } from './testimonials.model.js';
import { sendResponse, sendError } from '../../core/utils/response.js';

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find();
    sendResponse(res, 200, testimonials);
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body };
    const testimonial = await Testimonial.create(data);
    sendResponse(res, 201, testimonial);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    if (!testimonial) {
      sendError(res, 404, 'Testimonial not found');
      return;
    }
    sendResponse(res, 200, testimonial);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      sendError(res, 404, 'Testimonial not found');
      return;
    }
    sendResponse(res, 200, { message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
