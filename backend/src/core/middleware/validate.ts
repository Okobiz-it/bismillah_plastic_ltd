import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const err = error as any;
      const formattedErrors = err.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      
      res.status(400);
      next(new Error(`Validation Error: ${JSON.stringify(formattedErrors)}`));
    }
  };
};
