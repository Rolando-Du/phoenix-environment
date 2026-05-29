import { API_BASE_URL } from '../config/api';

export type CurrentWeather = {
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  weatherLabel: string;
  source: 'openmeteo' | 'openweather';
  available: boolean;
  cached: boolean;
  generatedAt: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type GetCurrentWeatherParams = {
  latitude?: number;
  longitude?: number;
};

type CurrentWeatherResponse = {
  success: boolean;
  source: 'openmeteo' | 'openweather';
  data: CurrentWeather;
};

const FALLBACK_WEATHER: CurrentWeather = {
  temperature: null,
  apparentTemperature: null,
  humidity: null,
  windSpeed: null,
  weatherCode: null,
  weatherLabel: 'Clima temporalmente no disponible',
  source: 'openmeteo',
  available: false,
  cached: false,
  generatedAt: new Date().toISOString(),
  coordinate: {
    latitude: 0,
    longitude: 0,
  },
};

export async function getCurrentWeather({
  latitude,
  longitude,
}: GetCurrentWeatherParams): Promise<CurrentWeather> {
  try {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return FALLBACK_WEATHER;
    }

    const params = new URLSearchParams();

    params.append('lat', String(latitude));
    params.append('lng', String(longitude));

    const response = await fetch(
      `${API_BASE_URL}/api/weather/current?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('No se pudo obtener el clima actual.');
    }

    const result = (await response.json()) as CurrentWeatherResponse;

    if (!result.success) {
      throw new Error('La API respondió con error.');
    }

    return result.data;
  } catch (error) {
    console.warn('No se pudo obtener clima actual:', error);

    return {
      ...FALLBACK_WEATHER,
      coordinate: {
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
      },
    };
  }
}