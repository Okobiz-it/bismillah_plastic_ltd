import type { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, data: any, message: string = 'Success') => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
