import { prisma } from '../config/prisma';

export type AlertLevel = 'info' | 'warning' | 'danger' | 'critical';

export type CurrentAlert = {
  active: boolean;
  level: AlertLevel;
  title: string;
  message: string;
  maxAqi: number | null;
  generatedAt: Date;
};

const RECENT_WINDOW_MINUTES = 30;

function buildAlertFromAqi(maxAqi: number | null): CurrentAlert {
  if (maxAqi === null) {
    return {
      active: false,
      level: 'info',
      title: 'Sin datos reales recientes',
      message:
        'No hay lecturas reales recientes de OpenAQ para generar alertas ambientales.',
      maxAqi: null,
      generatedAt: new Date(),
    };
  }

  if (maxAqi <= 50) {
    return {
      active: false,
      level: 'info',
      title: 'Calidad del aire buena',
      message: 'No se registran condiciones ambientales preocupantes.',
      maxAqi,
      generatedAt: new Date(),
    };
  }

  if (maxAqi <= 100) {
    return {
      active: true,
      level: 'warning',
      title: 'Calidad del aire moderada',
      message:
        'Personas sensibles deberían prestar atención a la exposición prolongada.',
      maxAqi,
      generatedAt: new Date(),
    };
  }

  if (maxAqi <= 150) {
    return {
      active: true,
      level: 'danger',
      title: 'Aire poco saludable para personas sensibles',
      message:
        'Se recomienda reducir actividades intensas al aire libre para grupos sensibles.',
      maxAqi,
      generatedAt: new Date(),
    };
  }

  return {
    active: true,
    level: 'critical',
    title: 'Alerta ambiental crítica',
    message:
      'La calidad del aire es mala. Se recomienda evitar exposición prolongada al aire libre.',
    maxAqi,
    generatedAt: new Date(),
  };
}

function getRecentDateLimit() {
  const now = new Date();

  return new Date(now.getTime() - RECENT_WINDOW_MINUTES * 60 * 1000);
}

export async function getCurrentAlert(): Promise<CurrentAlert> {
  const recentDateLimit = getRecentDateLimit();

  const stats = await prisma.aqiReading.aggregate({
    where: {
      source: 'openaq',
      recordedAt: {
        gte: recentDateLimit,
      },
    },
    _max: {
      value: true,
    },
  });

  return buildAlertFromAqi(stats._max.value);
}