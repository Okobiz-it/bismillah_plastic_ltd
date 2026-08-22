import type { Request, Response, NextFunction } from 'express';
import { Goal } from './goals.model.js';
import { sendResponse, sendError } from '../../core/utils/response.js';

export const getGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const goals = await Goal.find().sort({ stepNo: 1, year: 1 });
    sendResponse(res, 200, goals);
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const goal = await Goal.create(req.body);
    sendResponse(res, 201, goal);
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    if (!goal) {
      sendError(res, 404, 'Goal not found');
      return;
    }
    sendResponse(res, 200, goal);
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
      sendError(res, 404, 'Goal not found');
      return;
    }
    sendResponse(res, 200, { message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};
