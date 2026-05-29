export type CurrentWeather = {
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  weatherLabel: string;
  source: 'openmeteo';
  available: boolean;
  cached: boolean;
  generatedAt: Date;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type OpenMeteoWeatherResponse = {
  latitude: number;
  longitude: number;
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
};

type WeatherCacheEntry = {
  expiresAt: number;
  data: CurrentWeather;
};

const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CACHE_TTL_MINUTES = 15;
const WEATHER_UNAVAILABLE_CACHE_TTL_MINUTES = 5;

const weatherCache = new Map<string, WeatherCacheEntry>();

function buildOpenMeteoWeatherUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  });

  return `${OPEN_METEO_WEATHER_URL}?${params.toString()}`;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getWeatherLabel(weatherCode: number | null) {
  if (weatherCode === null) return 'Sin información climática';

  if (weatherCode === 0) return 'Cielo despejado';

  if ([1, 2, 3].includes(weatherCode)) {
    return 'Parcialmente nublado';
  }

  if ([45, 48].includes(weatherCode)) {
    return 'Niebla';
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return 'Llovizna';
  }

  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return 'Lluvia';
  }

  if ([71, 73, 75, 77].includes(weatherCode)) {
    return 'Nieve';
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return 'Chaparrones';
  }

  if ([85, 86].includes(weatherCode)) {
    return 'Nevadas aisladas';
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return 'Tormenta';
  }

  return 'Condición climática variable';
}

function buildCacheKey(latitude: number, longitude: number) {
  const roundedLatitude = latitude.toFixed(3);
  const roundedLongitude = longitude.toFixed(3);

  return `${roundedLatitude},${roundedLongitude}`;
}

function getCachedWeather(latitude: number, longitude: number) {
  const cacheKey = buildCacheKey(latitude, longitude);
  const cachedEntry = weatherCache.get(cacheKey);

  if (!cachedEntry) {
    return null;
  }

  if (cachedEntry.expiresAt < Date.now()) {
    weatherCache.delete(cacheKey);
    return null;
  }

  return {
    ...cachedEntry.data,
    cached: true,
  };
}

function saveWeatherToCache(
  weather: CurrentWeather,
  ttlMinutes = WEATHER_CACHE_TTL_MINUTES
) {
  const cacheKey = buildCacheKey(
    weather.coordinate.latitude,
    weather.coordinate.longitude
  );

  weatherCache.set(cacheKey, {
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    data: weather,
  });
}

function buildUnavailableWeather(
  latitude: number,
  longitude: number
): CurrentWeather {
  return {
    temperature: null,
    apparentTemperature: null,
    humidity: null,
    windSpeed: null,
    weatherCode: null,
    weatherLabel: 'Clima temporalmente no disponible',
    source: 'openmeteo',
    available: false,
    cached: false,
    generatedAt: new Date(),
    coordinate: {
      latitude,
      longitude,
    },
  };
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const cachedWeather = getCachedWeather(latitude, longitude);

  if (cachedWeather) {
    return cachedWeather;
  }

  const response = await fetch(buildOpenMeteoWeatherUrl(latitude, longitude), {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'PhoenixEnvironment/1.0',
    },
  });

  if (!response.ok) {
    console.warn(
      `Open-Meteo Weather no disponible temporalmente. Status: ${response.status}`
    );

    const unavailableWeather = buildUnavailableWeather(latitude, longitude);

    saveWeatherToCache(
      unavailableWeather,
      WEATHER_UNAVAILABLE_CACHE_TTL_MINUTES
    );

    return unavailableWeather;
  }

  const result = (await response.json()) as OpenMeteoWeatherResponse;

  const current = result.current;

  const temperature = isValidNumber(current?.temperature_2m)
    ? current.temperature_2m
    : null;

  const apparentTemperature = isValidNumber(current?.apparent_temperature)
    ? current.apparent_temperature
    : null;

  const humidity = isValidNumber(current?.relative_humidity_2m)
    ? current.relative_humidity_2m
    : null;

  const windSpeed = isValidNumber(current?.wind_speed_10m)
    ? current.wind_speed_10m
    : null;

  const weatherCode = isValidNumber(current?.weather_code)
    ? current.weather_code
    : null;

  const weather: CurrentWeather = {
    temperature,
    apparentTemperature,
    humidity,
    windSpeed,
    weatherCode,
    weatherLabel: getWeatherLabel(weatherCode),
    source: 'openmeteo',
    available: true,
    cached: false,
    generatedAt: new Date(),
    coordinate: {
      latitude,
      longitude,
    },
  };

  saveWeatherToCache(weather);

  return weather;
}