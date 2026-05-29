import { API_BASE_URL } from '../config/api';
import type { AqiSource } from './aqiService';

export type AqiSummarySource = 'all' | 'openaq' | 'openmeteo';

export type AqiHistoryItem = {
  id: string;
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  source: string;
  recordedAt: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

export type AqiSummary = {
  source: AqiSummarySource;
  totalReadings: number;
  latestReading: AqiHistoryItem | null;
  averageAqi: number | null;
  maxAqi: number | null;
  minAqi: number | null;
  generatedAt: string;
};

type GetAqiSummaryParams = {
  source?: AqiSummarySource | AqiSource;
};

type AqiSummaryResponse = {
  success: boolean;
  source: AqiSummarySource;
  data: AqiSummary;
};

const FALLBACK_SUMMARY: AqiSummary = {
  source: 'all',
  totalReadings: 0,
  latestReading: null,
  averageAqi: null,
  maxAqi: null,
  minAqi: null,
  generatedAt: new Date().toISOString(),
};

function normalizeSummarySource(
  source: AqiSummarySource | AqiSource
): AqiSummarySource {
  if (source === 'openaq' || source === 'openmeteo') {
    return source;
  }

  return 'all';
}

export async function getAqiSummary({
  source = 'all',
}: GetAqiSummaryParams = {}): Promise<AqiSummary> {
  const normalizedSource = normalizeSummarySource(source);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/aqi/summary?source=${normalizedSource}`
    );

    if (!response.ok) {
      throw new Error('No se pudo obtener el resumen AQI.');
    }

    const result = (await response.json()) as AqiSummaryResponse;

    if (!result.success) {
      throw new Error('La API respondió con error.');
    }

    return result.data;
  } catch (error) {
    console.warn('Usando summary AQI fallback:', error);

    return {
      ...FALLBACK_SUMMARY,
      source: normalizedSource,
    };
  }
}