import type { Request, Response } from 'express';

import { getCurrentAlert } from '../services/alert.service';

export async function getCurrentAlertController(
  _req: Request,
  res: Response
) {
  const alert = await getCurrentAlert();

  return res.status(200).json({
    success: true,
    data: alert,
  });
}