import { API_BASE_URL } from '../config/api';

export type AlertLevel = 'info' | 'warning' | 'danger' | 'critical';

export type CurrentAlert = {
  active: boolean;
  level: AlertLevel;
  title: string;
  message: string;
  maxAqi: number | null;
  generatedAt: string;
};

type CurrentAlertResponse = {
  success: boolean;
  data: CurrentAlert;
};

const FALLBACK_ALERT: CurrentAlert = {
  active: false,
  level: 'info',
  title: 'Sin alertas disponibles',
  message: 'No se pudo obtener información de alertas en este momento.',
  maxAqi: null,
  generatedAt: new Date().toISOString(),
};

export async function getCurrentAlert(): Promise<CurrentAlert> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alerts/current`);

    if (!response.ok) {
      throw new Error('No se pudo obtener la alerta actual.');
    }

    const result = (await response.json()) as CurrentAlertResponse;

    if (!result.success) {
      throw new Error('La API respondió con error.');
    }

    return result.data;
  } catch (error) {
    console.warn('Usando alerta fallback:', error);

    return FALLBACK_ALERT;
  }
}