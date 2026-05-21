import { API_BASE_URL } from '../config/api';
import { AQI_POINTS } from '../data/aqiPoints';
import type { AqiPoint } from '../data/aqiPoints';

type GetNearbyAqiPointsParams = {
  latitude?: number;
  longitude?: number;
};

type AqiNearbyResponse = {
  success: boolean;
  source: string;
  count: number;
  data: AqiPoint[];
};

export async function getNearbyAqiPoints({
  latitude,
  longitude,
}: GetNearbyAqiPointsParams = {}): Promise<AqiPoint[]> {
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

    return result.data;
  } catch (error) {
    console.warn('Usando datos AQI mock por fallback:', error);

    return AQI_POINTS;
  }
}