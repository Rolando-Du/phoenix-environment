import { calculateAqiFromPollutants } from '../utils/calculateAqi';

type OpenAqLocationSensor = {
  id: number;
  parameter?: {
    id: number;
    name: string;
    displayName?: string;
    units?: string;
  };
};

type OpenAqLocation = {
  id: number;
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  sensors?: OpenAqLocationSensor[];
};

type OpenAqLocationsResponse = {
  results: OpenAqLocation[];
};

type OpenAqLatestMeasurement = {
  value: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  sensorsId: number;
  locationsId: number;
  datetime?: {
    utc: string;
    local: string;
  };
};

type OpenAqLatestResponse = {
  results: OpenAqLatestMeasurement[];
};

export type OpenAqAqiPoint = {
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

const OPENAQ_BASE_URL = 'https://api.openaq.org/v3';

function getOpenAqApiKey() {
  const apiKey = process.env.OPENAQ_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAQ_API_KEY no está configurada en el archivo .env');
  }

  return apiKey;
}

async function fetchOpenAq<T>(path: string): Promise<T> {
  const response = await fetch(`${OPENAQ_BASE_URL}${path}`, {
    headers: {
      'X-API-Key': getOpenAqApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`OpenAQ respondió con status ${response.status}`);
  }

  return (await response.json()) as T;
}

function findSensorIdByParameterName(
  location: OpenAqLocation,
  parameterName: 'pm25' | 'pm10'
) {
  return location.sensors?.find(
    (sensor) => sensor.parameter?.name === parameterName
  )?.id;
}

function findLatestValueBySensorId(
  latestMeasurements: OpenAqLatestMeasurement[],
  sensorId?: number
) {
  if (!sensorId) return null;

  const value =
    latestMeasurements.find((measurement) => measurement.sensorsId === sensorId)
      ?.value ?? null;

  if (value === null || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

export async function getOpenAqNearbyPoints(
  latitude: number,
  longitude: number
): Promise<OpenAqAqiPoint[]> {
  const radius = 25000;
  const limit = 5;

  const locationsResponse = await fetchOpenAq<OpenAqLocationsResponse>(
    `/locations?coordinates=${latitude},${longitude}&radius=${radius}&limit=${limit}`
  );

  const locations = locationsResponse.results ?? [];

  const points = await Promise.all(
    locations.map(async (location) => {
      const latestResponse = await fetchOpenAq<OpenAqLatestResponse>(
        `/locations/${location.id}/latest`
      );

      const latestMeasurements = latestResponse.results ?? [];

      const pm25SensorId = findSensorIdByParameterName(location, 'pm25');
      const pm10SensorId = findSensorIdByParameterName(location, 'pm10');

      const pm25 = findLatestValueBySensorId(latestMeasurements, pm25SensorId);
      const pm10 = findLatestValueBySensorId(latestMeasurements, pm10SensorId);

      const latitudeValue =
        location.coordinates?.latitude ??
        latestMeasurements[0]?.coordinates?.latitude ??
        latitude;

      const longitudeValue =
        location.coordinates?.longitude ??
        latestMeasurements[0]?.coordinates?.longitude ??
        longitude;

      return {
        id: `openaq-${location.id}`,
        title: location.name,
        value: calculateAqiFromPollutants({
          pm25,
          pm10,
        }),
        pm25: pm25 ?? 0,
        pm10: pm10 ?? 0,
        coordinate: {
          latitude: latitudeValue,
          longitude: longitudeValue,
        },
      };
    })
  );

  return points.filter((point) => point.pm25 > 0 || point.pm10 > 0);
}