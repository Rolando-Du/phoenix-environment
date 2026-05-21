import type { LatLng } from 'react-native-maps';

export type AqiPoint = {
  id: string;
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  coordinate: LatLng;
};

export const AQI_POINTS: AqiPoint[] = [
  {
    id: 'centro',
    title: 'Centro',
    value: 42,
    pm25: 8,
    pm10: 18,
    coordinate: {
      latitude: -40.1579,
      longitude: -71.3534,
    },
  },
  {
    id: 'vega',
    title: 'La Vega',
    value: 80,
    pm25: 18,
    pm10: 34,
    coordinate: {
      latitude: -40.1512,
      longitude: -71.3254,
    },
  },
  {
    id: 'chacra',
    title: 'Chacra 4',
    value: 130,
    pm25: 31,
    pm10: 58,
    coordinate: {
      latitude: -40.1678,
      longitude: -71.3376,
    },
  },
  {
    id: 'lacar',
    title: 'Costanera Lago Lácar',
    value: 180,
    pm25: 46,
    pm10: 82,
    coordinate: {
      latitude: -40.1608,
      longitude: -71.3618,
    },
  },
];