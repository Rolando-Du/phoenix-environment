import type { Request, Response } from 'express';

import {
  getAqiHistory,
  getAqiSummary,
  getNearbyAqiPoints,
} from '../services/aqi.service';
import type { AqiHistorySource } from '../services/aqi.service';

function parseHistorySource(source: unknown): AqiHistorySource | null {
  if (source === undefined) {
    return 'all';
  }

  if (source === 'all' || source === 'mock' || source === 'openaq') {
    return source;
  }

  return null;
}

function parseLimit(limit: unknown): number | undefined {
  if (limit === undefined) {
    return undefined;
  }

  const parsedLimit = Number(limit);

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return undefined;
  }

  return parsedLimit;
}

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

export async function getAqiHistoryController(req: Request, res: Response) {
  const source = parseHistorySource(req.query.source);
  const limit = parseLimit(req.query.limit);

  if (!source) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro source debe ser: all, mock u openaq.',
    });
  }

  const history = await getAqiHistory({
    source,
    limit,
  });

  return res.status(200).json({
    success: true,
    source,
    count: history.length,
    data: history,
  });
}

export async function getAqiSummaryController(req: Request, res: Response) {
  const source = parseHistorySource(req.query.source);

  if (!source) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro source debe ser: all, mock u openaq.',
    });
  }

  const summary = await getAqiSummary({
    source,
  });

  return res.status(200).json({
    success: true,
    source,
    data: summary,
  });
}