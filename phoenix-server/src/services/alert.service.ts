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

function buildAlertFromAqi(maxAqi: number | null): CurrentAlert {
  if (maxAqi === null) {
    return {
      active: false,
      level: 'info',
      title: 'Sin datos suficientes',
      message: 'Todavía no hay lecturas AQI disponibles para generar alertas.',
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

export async function getCurrentAlert(): Promise<CurrentAlert> {
  const stats = await prisma.aqiReading.aggregate({
    _max: {
      value: true,
    },
  });

  return buildAlertFromAqi(stats._max.value);
}