import { calculateAqiFromPollutants } from '../utils/calculateAqi';

type OpenMeteoAirQualityResponse = {
  latitude: number;
  longitude: number;
  hourly?: {
    time?: string[];
    pm10?: Array<number | null>;
    pm2_5?: Array<number | null>;
  };
};

export type OpenMeteoAqiPoint = {
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

const OPEN_METEO_AIR_QUALITY_URL =
  'https://air-quality-api.open-meteo.com/v1/air-quality';

function buildOpenMeteoUrl(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'pm10,pm2_5',
    forecast_days: '1',
    timezone: 'auto',
  });

  return `${OPEN_METEO_AIR_QUALITY_URL}?${params.toString()}`;
}

function isValidNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function findBestHourlyIndex(response: OpenMeteoAirQualityResponse) {
  const times = response.hourly?.time ?? [];
  const pm10Values = response.hourly?.pm10 ?? [];
  const pm25Values = response.hourly?.pm2_5 ?? [];

  if (times.length === 0) {
    return -1;
  }

  const now = Date.now();

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < times.length; index += 1) {
    const hasPm10 = isValidNumber(pm10Values[index]);
    const hasPm25 = isValidNumber(pm25Values[index]);

    if (!hasPm10 && !hasPm25) {
      continue;
    }

    const time = new Date(times[index]).getTime();

    if (!Number.isFinite(time)) {
      continue;
    }

    const distance = Math.abs(time - now);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return bestIndex;
}

export async function getOpenMeteoAqiPoint(
  latitude: number,
  longitude: number
): Promise<OpenMeteoAqiPoint | null> {
  const response = await fetch(buildOpenMeteoUrl(latitude, longitude));

  if (!response.ok) {
    throw new Error(`Open-Meteo respondió con status ${response.status}`);
  }

  const result = (await response.json()) as OpenMeteoAirQualityResponse;

  const bestIndex = findBestHourlyIndex(result);

  if (bestIndex < 0) {
    return null;
  }

  const pm25Raw = result.hourly?.pm2_5?.[bestIndex];
  const pm10Raw = result.hourly?.pm10?.[bestIndex];

  const pm25 = isValidNumber(pm25Raw) ? pm25Raw : null;
  const pm10 = isValidNumber(pm10Raw) ? pm10Raw : null;

  if (pm25 === null && pm10 === null) {
    return null;
  }

  return {
    id: 'openmeteo-current',
    title: 'Calidad del aire local',
    value: calculateAqiFromPollutants({
      pm25,
      pm10,
    }),
    pm25: pm25 ?? 0,
    pm10: pm10 ?? 0,
    coordinate: {
      latitude,
      longitude,
    },
  };
}