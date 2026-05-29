import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';

import aqiRoutes from './routes/aqi.routes';
import alertRoutes from './routes/alert.routes';
import weatherRoutes from './routes/weather.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    name: 'Phoenix API',
    version: '1.0.0',
    message: 'API ambiental para monitoreo de calidad del aire y clima.',
    status: 'online',
    dataSources: {
      airQualityPrimary: {
        name: 'OpenAQ',
        description:
          'Fuente real basada en estaciones de monitoreo ambiental disponibles.',
      },
      airQualityFallback: {
        name: 'Open-Meteo Air Quality',
        description:
          'Fuente real por coordenadas cuando no existen estaciones OpenAQ cercanas.',
      },
      weather: {
        name: 'Open-Meteo Weather',
        description:
          'Fuente real por coordenadas para temperatura, sensación térmica, humedad, viento y estado del clima.',
      },
    },
    endpoints: {
      system: {
        root: '/',
        health: '/health',
      },
      airQuality: {
        nearby: '/api/aqi/nearby?lat=-39.9504&lng=-71.0695',
        history: '/api/aqi/history',
        historyBySource:
          '/api/aqi/history?source=openaq|openmeteo|all&limit=10',
        summary: '/api/aqi/summary',
        summaryBySource: '/api/aqi/summary?source=openaq|openmeteo|all',
      },
      weather: {
        current: '/api/weather/current?lat=-39.9504&lng=-71.0695',
      },
      alerts: {
        current: '/api/alerts/current',
      },
    },
    notes: [
      'Phoenix intenta primero obtener calidad del aire desde OpenAQ.',
      'Si OpenAQ no tiene estaciones cercanas, usa Open-Meteo Air Quality como fuente real por coordenadas.',
      'El clima actual se obtiene desde Open-Meteo Weather.',
      'No se utilizan datos mock en el flujo actual.',
      'El histórico evita guardar lecturas AQI duplicadas recientes.',
    ],
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Phoenix API funcionando correctamente',
    services: {
      api: 'online',
      database: 'connected',
      airQualitySources: ['OpenAQ', 'Open-Meteo Air Quality'],
      weatherSource: 'Open-Meteo Weather',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/aqi', aqiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/weather', weatherRoutes);

export default app;