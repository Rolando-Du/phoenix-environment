import { prisma } from '../config/prisma';
import { getOpenAqNearbyPoints } from './openAq.service';

export type AqiPoint = {
  id: string;
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type GetNearbyAqiParams = {
  latitude?: number;
  longitude?: number;
};

export type AqiNearbySource = 'mock' | 'openaq';

export type AqiNearbyResult = {
  source: AqiNearbySource;
  points: AqiPoint[];
};

export type AqiHistoryItem = {
  id: string;
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  source: string;
  recordedAt: Date;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

export type AqiSummary = {
  totalReadings: number;
  latestReading: AqiHistoryItem | null;
  averageAqi: number | null;
  maxAqi: number | null;
  minAqi: number | null;
  generatedAt: Date;
};

const DEFAULT_LATITUDE = -40.1579;
const DEFAULT_LONGITUDE = -71.3534;

function buildMockAqiPoints(latitude: number, longitude: number): AqiPoint[] {
  return [
    {
      id: 'user-zone',
      title: 'Tu zona',
      value: 42,
      pm25: 8,
      pm10: 18,
      coordinate: {
        latitude,
        longitude,
      },
    },
    {
      id: 'north-zone',
      title: 'Zona norte',
      value: 80,
      pm25: 18,
      pm10: 34,
      coordinate: {
        latitude: latitude + 0.015,
        longitude: longitude + 0.012,
      },
    },
    {
      id: 'south-zone',
      title: 'Zona sur',
      value: 130,
      pm25: 31,
      pm10: 58,
      coordinate: {
        latitude: latitude - 0.015,
        longitude: longitude - 0.012,
      },
    },
    {
      id: 'west-zone',
      title: 'Zona oeste',
      value: 180,
      pm25: 46,
      pm10: 82,
      coordinate: {
        latitude: latitude + 0.006,
        longitude: longitude - 0.02,
      },
    },
  ];
}

async function saveAqiReadings(points: AqiPoint[], source: AqiNearbySource) {
  try {
    await prisma.aqiReading.createMany({
      data: points.map((point) => ({
        title: point.title,
        latitude: point.coordinate.latitude,
        longitude: point.coordinate.longitude,
        value: point.value,
        pm25: point.pm25,
        pm10: point.pm10,
        source,
      })),
    });
  } catch (error) {
    console.error('No se pudo guardar el histórico AQI:', error);
  }
}

export async function getNearbyAqiPoints({
  latitude,
  longitude,
}: GetNearbyAqiParams): Promise<AqiNearbyResult> {
  const baseLatitude = latitude ?? DEFAULT_LATITUDE;
  const baseLongitude = longitude ?? DEFAULT_LONGITUDE;

  try {
    const openAqPoints = await getOpenAqNearbyPoints(
      baseLatitude,
      baseLongitude
    );

    if (openAqPoints.length > 0) {
      await saveAqiReadings(openAqPoints, 'openaq');

      return {
        source: 'openaq',
        points: openAqPoints,
      };
    }

    console.warn('OpenAQ no devolvió puntos cercanos. Usando mock temporal.');
  } catch (error) {
    console.error('No se pudieron obtener datos desde OpenAQ:', error);
  }

  const mockPoints = buildMockAqiPoints(baseLatitude, baseLongitude);

  await saveAqiReadings(mockPoints, 'mock');

  return {
    source: 'mock',
    points: mockPoints,
  };
}

export async function getAqiHistory(): Promise<AqiHistoryItem[]> {
  const readings = await prisma.aqiReading.findMany({
    orderBy: {
      recordedAt: 'desc',
    },
    take: 20,
  });

  return readings.map((reading) => ({
    id: reading.id,
    title: reading.title,
    value: reading.value,
    pm25: reading.pm25,
    pm10: reading.pm10,
    source: reading.source,
    recordedAt: reading.recordedAt,
    coordinate: {
      latitude: reading.latitude,
      longitude: reading.longitude,
    },
  }));
}

export async function getAqiSummary(): Promise<AqiSummary> {
  const [totalReadings, latestReading, stats] = await Promise.all([
    prisma.aqiReading.count(),

    prisma.aqiReading.findFirst({
      orderBy: {
        recordedAt: 'desc',
      },
    }),

    prisma.aqiReading.aggregate({
      _avg: {
        value: true,
      },
      _max: {
        value: true,
      },
      _min: {
        value: true,
      },
    }),
  ]);

  return {
    totalReadings,
    latestReading: latestReading
      ? {
          id: latestReading.id,
          title: latestReading.title,
          value: latestReading.value,
          pm25: latestReading.pm25,
          pm10: latestReading.pm10,
          source: latestReading.source,
          recordedAt: latestReading.recordedAt,
          coordinate: {
            latitude: latestReading.latitude,
            longitude: latestReading.longitude,
          },
        }
      : null,
    averageAqi:
      stats._avg.value !== null ? Math.round(stats._avg.value) : null,
    maxAqi: stats._max.value,
    minAqi: stats._min.value,
    generatedAt: new Date(),
  };
}