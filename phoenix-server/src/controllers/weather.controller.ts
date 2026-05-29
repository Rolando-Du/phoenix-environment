import type { Request, Response } from 'express';

import { getCurrentWeather } from '../services/weather.service';

function parseCoordinate(value: unknown): number | null {
  if (value === undefined || value === '') {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

export async function getCurrentWeatherController(
  req: Request,
  res: Response
) {
  const latitude = parseCoordinate(req.query.lat);
  const longitude = parseCoordinate(req.query.lng);

  if (latitude === null || longitude === null) {
    return res.status(400).json({
      success: false,
      message: 'Latitud y longitud son obligatorias.',
      example: '/api/weather/current?lat=-39.9504&lng=-71.0695',
    });
  }

  try {
    const weather = await getCurrentWeather(latitude, longitude);

    return res.status(200).json({
      success: true,
      source: weather.source,
      data: weather,
    });
  } catch (error) {
    console.error('No se pudo obtener el clima actual:', error);

    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener el clima actual.',
    });
  }
}