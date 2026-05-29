export type WeatherSource = 'openmeteo' | 'openweather';

export type CurrentWeather = {
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  weatherLabel: string;
  source: WeatherSource;
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

type OpenWeatherResponse = {
  weather?: Array<{
    id?: number;
    main?: string;
    description?: string;
  }>;
  main?: {
    temp?: number;
    feels_like?: number;
    humidity?: number;
  };
  wind?: {
    speed?: number;
  };
};

type WeatherCacheEntry = {
  expiresAt: number;
  data: CurrentWeather;
};

const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

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

function buildOpenWeatherUrl(latitude: number, longitude: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: apiKey,
    units: 'metric',
    lang: 'es',
  });

  return `${OPENWEATHER_URL}?${params.toString()}`;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function capitalizeText(value: string) {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getOpenMeteoWeatherLabel(weatherCode: number | null) {
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

async function getWeatherFromOpenMeteo(
  latitude: number,
  longitude: number
): Promise<CurrentWeather | null> {
  try {
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

      return null;
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

    return {
      temperature,
      apparentTemperature,
      humidity,
      windSpeed,
      weatherCode,
      weatherLabel: getOpenMeteoWeatherLabel(weatherCode),
      source: 'openmeteo',
      available: true,
      cached: false,
      generatedAt: new Date(),
      coordinate: {
        latitude,
        longitude,
      },
    };
  } catch (error) {
    console.warn('Open-Meteo Weather falló:', error);

    return null;
  }
}

async function getWeatherFromOpenWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather | null> {
  const openWeatherUrl = buildOpenWeatherUrl(latitude, longitude);

  if (!openWeatherUrl) {
    console.warn('OPENWEATHER_API_KEY no está configurada.');

    return null;
  }

  try {
    const response = await fetch(openWeatherUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'PhoenixEnvironment/1.0',
      },
    });

    if (!response.ok) {
      console.warn(
        `OpenWeather no disponible temporalmente. Status: ${response.status}`
      );

      return null;
    }

    const result = (await response.json()) as OpenWeatherResponse;

    const temperature = isValidNumber(result.main?.temp)
      ? result.main.temp
      : null;

    const apparentTemperature = isValidNumber(result.main?.feels_like)
      ? result.main.feels_like
      : null;

    const humidity = isValidNumber(result.main?.humidity)
      ? result.main.humidity
      : null;

    const windSpeed = isValidNumber(result.wind?.speed)
      ? Number((result.wind.speed * 3.6).toFixed(1))
      : null;

    const weatherCode = isValidNumber(result.weather?.[0]?.id)
      ? result.weather[0].id
      : null;

    const weatherLabel =
      result.weather?.[0]?.description ??
      result.weather?.[0]?.main ??
      'Condición climática disponible';

    return {
      temperature,
      apparentTemperature,
      humidity,
      windSpeed,
      weatherCode,
      weatherLabel: capitalizeText(weatherLabel),
      source: 'openweather',
      available: true,
      cached: false,
      generatedAt: new Date(),
      coordinate: {
        latitude,
        longitude,
      },
    };
  } catch (error) {
    console.warn('OpenWeather falló:', error);

    return null;
  }
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const cachedWeather = getCachedWeather(latitude, longitude);

  if (cachedWeather) {
    return cachedWeather;
  }

  const openMeteoWeather = await getWeatherFromOpenMeteo(latitude, longitude);

  if (openMeteoWeather) {
    saveWeatherToCache(openMeteoWeather);

    return openMeteoWeather;
  }

  const openWeather = await getWeatherFromOpenWeather(latitude, longitude);

  if (openWeather) {
    saveWeatherToCache(openWeather);

    return openWeather;
  }

  const unavailableWeather = buildUnavailableWeather(latitude, longitude);

  saveWeatherToCache(unavailableWeather, WEATHER_UNAVAILABLE_CACHE_TTL_MINUTES);

  return unavailableWeather;
}