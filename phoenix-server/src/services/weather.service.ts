export type CurrentWeather = {
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number | null;
  weatherLabel: string;
  source: 'openmeteo';
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

const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

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

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const response = await fetch(buildOpenMeteoWeatherUrl(latitude, longitude));

  if (!response.ok) {
    throw new Error(`Open-Meteo Weather respondió con status ${response.status}`);
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
    weatherLabel: getWeatherLabel(weatherCode),
    source: 'openmeteo',
    generatedAt: new Date(),
    coordinate: {
      latitude,
      longitude,
    },
  };
}