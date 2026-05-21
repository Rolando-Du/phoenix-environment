import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';

import aqiRoutes from './routes/aqi.routes';
import alertRoutes from './routes/alert.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a Phoenix API',
    endpoints: {
      health: '/health',
      aqiNearby: '/api/aqi/nearby',
      aqiHistory: '/api/aqi/history',
      aqiSummary: '/api/aqi/summary',
      alertsCurrent: '/api/alerts/current',
    },
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Phoenix API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/aqi', aqiRoutes);
app.use('/api/alerts', alertRoutes);

export default app;