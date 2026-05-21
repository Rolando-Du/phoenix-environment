export type AqiStatus = {
  label: string;
  description: string;
  color: string;
};

export function getAqiStatus(value: number): AqiStatus {
  if (!Number.isFinite(value) || value < 0) {
    return {
      label: 'Sin datos',
      description: 'No hay información disponible sobre la calidad del aire.',
      color: '#94a3b8',
    };
  }

  if (value <= 50) {
    return {
      label: 'Buena',
      description: 'La calidad del aire es saludable en tu zona.',
      color: '#22c55e',
    };
  }

  if (value <= 100) {
    return {
      label: 'Moderada',
      description:
        'La calidad del aire es aceptable, pero puede afectar a personas sensibles.',
      color: '#eab308',
    };
  }

  if (value <= 150) {
    return {
      label: 'Mala para sensibles',
      description:
        'Personas con problemas respiratorios deberían reducir la exposición.',
      color: '#f97316',
    };
  }

  if (value <= 200) {
    return {
      label: 'Mala',
      description:
        'La calidad del aire puede afectar la salud de la población general.',
      color: '#ef4444',
    };
  }

  if (value <= 300) {
    return {
      label: 'Muy mala',
      description: 'Se recomienda evitar actividades al aire libre.',
      color: '#a855f7',
    };
  }

  return {
    label: 'Peligrosa',
    description:
      'La calidad del aire es peligrosa. Se recomienda permanecer en interiores.',
    color: '#7f1d1d',
  };
}