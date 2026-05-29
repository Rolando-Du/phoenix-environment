import { prisma } from '../config/prisma';
import { getOpenAqNearbyPoints } from './openAq.service';
import { getOpenMeteoAqiPoint } from './openMeteo.service';

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

export type AqiPersistedSource = 'openaq' | 'openmeteo';

export type AqiNearbySource = AqiPersistedSource | 'unavailable';

export type AqiHistorySource = AqiPersistedSource | 'all';

export type AqiNearbyResult = {
  source: AqiNearbySource;
  points: AqiPoint[];
};

export type GetAqiHistoryParams = {
  source?: AqiHistorySource;
  limit?: number;
};

export type GetAqiSummaryParams = {
  source?: AqiHistorySource;
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
  source: AqiHistorySource;
  totalReadings: number;
  latestReading: AqiHistoryItem | null;
  averageAqi: number | null;
  maxAqi: number | null;
  minAqi: number | null;
  generatedAt: Date;
};

const DEFAULT_LATITUDE = -40.1579;
const DEFAULT_LONGITUDE = -71.3534;
const DEFAULT_HISTORY_LIMIT = 20;
const MAX_HISTORY_LIMIT = 100;
const DUPLICATE_WINDOW_MINUTES = 15;
const COORDINATE_TOLERANCE = 0.0001;

function normalizeHistoryLimit(limit?: number) {
  if (!limit || !Number.isFinite(limit) || limit <= 0) {
    return DEFAULT_HISTORY_LIMIT;
  }

  return Math.min(Math.floor(limit), MAX_HISTORY_LIMIT);
}

function buildSourceWhere(source: AqiHistorySource) {
  if (source === 'all') {
    return undefined;
  }

  return {
    source,
  };
}

function getDuplicateDateLimit() {
  const now = new Date();

  return new Date(now.getTime() - DUPLICATE_WINDOW_MINUTES * 60 * 1000);
}

async function hasRecentSimilarReading(
  point: AqiPoint,
  source: AqiPersistedSource
) {
  const duplicateDateLimit = getDuplicateDateLimit();

  const existingReading = await prisma.aqiReading.findFirst({
    where: {
      source,
      title: point.title,
      recordedAt: {
        gte: duplicateDateLimit,
      },
      latitude: {
        gte: point.coordinate.latitude - COORDINATE_TOLERANCE,
        lte: point.coordinate.latitude + COORDINATE_TOLERANCE,
      },
      longitude: {
        gte: point.coordinate.longitude - COORDINATE_TOLERANCE,
        lte: point.coordinate.longitude + COORDINATE_TOLERANCE,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(existingReading);
}

async function saveAqiReadingsIfNotDuplicated(
  points: AqiPoint[],
  source: AqiPersistedSource
) {
  if (points.length === 0) return;

  try {
    const pointsToSave: AqiPoint[] = [];

    for (const point of points) {
      const alreadyExists = await hasRecentSimilarReading(point, source);

      if (!alreadyExists) {
        pointsToSave.push(point);
      }
    }

    if (pointsToSave.length === 0) {
      console.log(
        `Lecturas AQI ${source} omitidas: ya existen registros similares recientes.`
      );
      return;
    }

    await prisma.aqiReading.createMany({
      data: pointsToSave.map((point) => ({
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
      await saveAqiReadingsIfNotDuplicated(openAqPoints, 'openaq');

      return {
        source: 'openaq',
        points: openAqPoints,
      };
    }

    console.log(
      'OpenAQ sin datos cercanos. Usando Open-Meteo como fuente real por coordenadas.'
    );
  } catch (error) {
    console.error('No se pudieron obtener datos desde OpenAQ:', error);
  }

  try {
    const openMeteoPoint = await getOpenMeteoAqiPoint(
      baseLatitude,
      baseLongitude
    );

    if (openMeteoPoint) {
      const openMeteoPoints: AqiPoint[] = [openMeteoPoint];

      await saveAqiReadingsIfNotDuplicated(openMeteoPoints, 'openmeteo');

      return {
        source: 'openmeteo',
        points: openMeteoPoints,
      };
    }

    console.warn('Open-Meteo no devolvió datos útiles.');
  } catch (error) {
    console.error('No se pudieron obtener datos desde Open-Meteo:', error);
  }

  return {
    source: 'unavailable',
    points: [],
  };
}

export async function getAqiHistory({
  source = 'all',
  limit = DEFAULT_HISTORY_LIMIT,
}: GetAqiHistoryParams = {}): Promise<AqiHistoryItem[]> {
  const safeLimit = normalizeHistoryLimit(limit);

  const readings = await prisma.aqiReading.findMany({
    where: buildSourceWhere(source),
    orderBy: {
      recordedAt: 'desc',
    },
    take: safeLimit,
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

export async function getAqiSummary({
  source = 'all',
}: GetAqiSummaryParams = {}): Promise<AqiSummary> {
  const where = buildSourceWhere(source);

  const [totalReadings, latestReading, stats] = await Promise.all([
    prisma.aqiReading.count({
      where,
    }),

    prisma.aqiReading.findFirst({
      where,
      orderBy: {
        recordedAt: 'desc',
      },
    }),

    prisma.aqiReading.aggregate({
      where,
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
    source,
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