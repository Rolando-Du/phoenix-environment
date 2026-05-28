import { API_BASE_URL } from '../config/api';
import type { AqiSummarySource } from './aqiSummaryService';

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

type GetAqiHistoryParams = {
  source?: AqiSummarySource;
  limit?: number;
};

type AqiHistoryResponse = {
  success: boolean;
  source: AqiSummarySource;
  count: number;
  data: AqiHistoryItem[];
};

export async function getAqiHistory({
  source = 'all',
  limit = 10,
}: GetAqiHistoryParams = {}): Promise<AqiHistoryItem[]> {
  try {
    const params = new URLSearchParams();

    params.append('source', source);
    params.append('limit', String(limit));

    const response = await fetch(
      `${API_BASE_URL}/api/aqi/history?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('No se pudo obtener el historial AQI.');
    }

    const result = (await response.json()) as AqiHistoryResponse;

    if (!result.success) {
      throw new Error('La API respondió con error.');
    }

    return result.data;
  } catch (error) {
    console.warn('Usando historial AQI fallback:', error);

    return [];
  }
}