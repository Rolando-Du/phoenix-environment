import { API_BASE_URL } from '../config/api';
import type { AqiPoint } from '../data/aqiPoints';

type GetNearbyAqiPointsParams = {
  latitude?: number;
  longitude?: number;
};

export type AqiSource = 'openaq' | 'openmeteo' | 'unavailable';

export type NearbyAqiResult = {
  source: AqiSource;
  points: AqiPoint[];
};

type AqiNearbyResponse = {
  success: boolean;
  source: AqiSource;
  count: number;
  data: AqiPoint[];
};

const FALLBACK_AQI_RESULT: NearbyAqiResult = {
  source: 'unavailable',
  points: [],
};

export async function getNearbyAqiPoints({
  latitude,
  longitude,
}: GetNearbyAqiPointsParams = {}): Promise<NearbyAqiResult> {
  try {
    const params = new URLSearchParams();

    if (typeof latitude === 'number') {
      params.append('lat', String(latitude));
    }

    if (typeof longitude === 'number') {
      params.append('lng', String(longitude));
    }

    const queryString = params.toString();

    const url = queryString
      ? `${API_BASE_URL}/api/aqi/nearby?${queryString}`
      : `${API_BASE_URL}/api/aqi/nearby`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('No se pudo obtener información AQI.');
    }

    const result = (await response.json()) as AqiNearbyResponse;

    if (!result.success) {
      throw new Error('La API respondió con error.');
    }

    return {
      source: result.source,
      points: result.data,
    };
  } catch (error) {
    console.warn('No se pudo obtener AQI real:', error);

    return FALLBACK_AQI_RESULT;
  }
}