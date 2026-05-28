import type { Request, Response } from 'express';

import {
  getAqiHistory,
  getAqiSummary,
  getNearbyAqiPoints,
} from '../services/aqi.service';

export async function getNearbyAqi(req: Request, res: Response) {
  const latitude = req.query.lat ? Number(req.query.lat) : undefined;
  const longitude = req.query.lng ? Number(req.query.lng) : undefined;

  if (
    (latitude !== undefined && Number.isNaN(latitude)) ||
    (longitude !== undefined && Number.isNaN(longitude))
  ) {
    return res.status(400).json({
      success: false,
      message: 'Latitud o longitud inválida.',
    });
  }

  const result = await getNearbyAqiPoints({
    latitude,
    longitude,
  });

  const { source, points } = result;

  return res.status(200).json({
    success: true,
    source,
    receivedLocation: {
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    },
    count: points.length,
    data: points,
  });
}

export async function getAqiHistoryController(_req: Request, res: Response) {
  const history = await getAqiHistory();

  return res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
}

export async function getAqiSummaryController(_req: Request, res: Response) {
  const summary = await getAqiSummary();

  return res.status(200).json({
    success: true,
    data: summary,
  });
}