import express from 'express';
import type { Request, Response, NextFunction } from 'express';

export const router = express.Router();

router.get('/', (_request: Request, response: Response) => {
  response.status(200).json({ message: 'FlowBit API is running.' });
});

router.get('/health', (_request: Request, response: Response) => {
  response.status(200).json({ status: 'ok' });
});

