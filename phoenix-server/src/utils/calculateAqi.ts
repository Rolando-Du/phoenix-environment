type AqiBreakpoint = {
  concentrationLow: number;
  concentrationHigh: number;
  aqiLow: number;
  aqiHigh: number;
};

const PM25_BREAKPOINTS: AqiBreakpoint[] = [
  {
    concentrationLow: 0.0,
    concentrationHigh: 9.0,
    aqiLow: 0,
    aqiHigh: 50,
  },
  {
    concentrationLow: 9.1,
    concentrationHigh: 35.4,
    aqiLow: 51,
    aqiHigh: 100,
  },
  {
    concentrationLow: 35.5,
    concentrationHigh: 55.4,
    aqiLow: 101,
    aqiHigh: 150,
  },
  {
    concentrationLow: 55.5,
    concentrationHigh: 125.4,
    aqiLow: 151,
    aqiHigh: 200,
  },
  {
    concentrationLow: 125.5,
    concentrationHigh: 225.4,
    aqiLow: 201,
    aqiHigh: 300,
  },
  {
    concentrationLow: 225.5,
    concentrationHigh: 325.4,
    aqiLow: 301,
    aqiHigh: 500,
  },
];

const PM10_BREAKPOINTS: AqiBreakpoint[] = [
  {
    concentrationLow: 0,
    concentrationHigh: 54,
    aqiLow: 0,
    aqiHigh: 50,
  },
  {
    concentrationLow: 55,
    concentrationHigh: 154,
    aqiLow: 51,
    aqiHigh: 100,
  },
  {
    concentrationLow: 155,
    concentrationHigh: 254,
    aqiLow: 101,
    aqiHigh: 150,
  },
  {
    concentrationLow: 255,
    concentrationHigh: 354,
    aqiLow: 151,
    aqiHigh: 200,
  },
  {
    concentrationLow: 355,
    concentrationHigh: 424,
    aqiLow: 201,
    aqiHigh: 300,
  },
  {
    concentrationLow: 425,
    concentrationHigh: 604,
    aqiLow: 301,
    aqiHigh: 500,
  },
];

function calculateAqiFromBreakpoints(
  concentration: number,
  breakpoints: AqiBreakpoint[]
): number | null {
  if (!Number.isFinite(concentration) || concentration < 0) {
    return null;
  }

  const matchingBreakpoint = breakpoints.find(
    (breakpoint) =>
      concentration >= breakpoint.concentrationLow &&
      concentration <= breakpoint.concentrationHigh
  );

  if (!matchingBreakpoint) {
    return null;
  }

  const {
    concentrationLow,
    concentrationHigh,
    aqiLow,
    aqiHigh,
  } = matchingBreakpoint;

  const aqi =
    ((aqiHigh - aqiLow) / (concentrationHigh - concentrationLow)) *
      (concentration - concentrationLow) +
    aqiLow;

  return Math.round(aqi);
}

export function calculatePm25Aqi(pm25: number | null): number | null {
  if (pm25 === null) return null;

  return calculateAqiFromBreakpoints(pm25, PM25_BREAKPOINTS);
}

export function calculatePm10Aqi(pm10: number | null): number | null {
  if (pm10 === null) return null;

  return calculateAqiFromBreakpoints(pm10, PM10_BREAKPOINTS);
}

export function calculateAqiFromPollutants(params: {
  pm25: number | null;
  pm10: number | null;
}): number {
  const pm25Aqi = calculatePm25Aqi(params.pm25);
  const pm10Aqi = calculatePm10Aqi(params.pm10);

  const validAqiValues = [pm25Aqi, pm10Aqi].filter(
    (value): value is number => value !== null
  );

  if (validAqiValues.length === 0) {
    return 0;
  }

  return Math.max(...validAqiValues);
}