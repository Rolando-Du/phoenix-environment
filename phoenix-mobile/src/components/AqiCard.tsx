import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import type { AqiSource } from "../services/aqiService";
import type { CurrentWeather } from "../services/weatherService";
import { getAqiStatus } from "../utils/getAqiStatus";

type AqiCardProps = {
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  source: AqiSource;
  weather?: CurrentWeather | null;
};

function getSourceLabel(source: AqiSource) {
  if (source === "openaq") return "OpenAQ";
  if (source === "openmeteo") return "Open-Meteo";

  return "Sin datos";
}

function getSourceDescription(source: AqiSource) {
  if (source === "openaq") {
    return "Dato real de estación ambiental cercana.";
  }

  if (source === "openmeteo") {
    return "Dato real estimado por coordenada geográfica.";
  }

  return "No hay una fuente disponible para esta zona.";
}

function getSourceColor(source: AqiSource) {
  if (source === "openaq") return "#22c55e";
  if (source === "openmeteo") return "#38bdf8";

  return "#94a3b8";
}

function getWalkingRecommendation(aqi: number) {
  if (aqi <= 50) {
    return "Podés caminar normalmente. La calidad del aire es buena para actividades al aire libre.";
  }

  if (aqi <= 100) {
    return "Podés caminar, pero si tenés asma, alergias o sensibilidad respiratoria, evitá esfuerzos intensos o caminatas muy largas.";
  }

  if (aqi <= 150) {
    return "Conviene reducir la actividad física intensa. Personas sensibles deberían evitar caminatas prolongadas.";
  }

  if (aqi <= 200) {
    return "No es recomendable realizar caminatas largas. Evitá esfuerzo físico al aire libre si pertenecés a un grupo sensible.";
  }

  return "Evitá salir a caminar o realizar actividad física al aire libre. La calidad del aire puede ser perjudicial.";
}

function getWeatherWalkingTip(weather?: CurrentWeather | null) {
  if (!weather || !weather.available) {
    return "El clima no está disponible temporalmente. Usá principalmente el AQI para tomar la decisión.";
  }

  if (
    typeof weather.apparentTemperature === "number" &&
    weather.apparentTemperature <= 5
  ) {
    return "La sensación térmica es baja. Si vas a caminar, llevá abrigo y evitá exposición prolongada al frío.";
  }

  if (typeof weather.windSpeed === "number" && weather.windSpeed >= 30) {
    return "Hay viento considerable. Para caminar o trekking, conviene elegir zonas reparadas o reducir el tiempo de exposición.";
  }

  if (typeof weather.temperature === "number" && weather.temperature >= 28) {
    return "La temperatura es alta. Hidratate bien y evitá caminatas intensas en horarios de mayor calor.";
  }

  return "Las condiciones climáticas acompañan bien para caminar, siempre considerando el estado del aire y tu condición física.";
}

function formatTemperature(value: number | null | undefined) {
  return typeof value === "number" ? `${value.toFixed(1)}°C` : "--";
}

function formatPercent(value: number | null | undefined) {
  return typeof value === "number" ? `${Math.round(value)}%` : "--";
}

function formatWind(value: number | null | undefined) {
  return typeof value === "number" ? `${value.toFixed(1)} km/h` : "--";
}

export default function AqiCard({
  title,
  value,
  pm25,
  pm10,
  source,
  weather,
}: AqiCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { height } = useWindowDimensions();

  const aqiStatus = getAqiStatus(value);
  const sourceColor = getSourceColor(source);

  const cardMaxHeight = expanded ? height * 0.73 : undefined;
  const hasWeather = Boolean(weather?.available);

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: sourceColor,
          maxHeight: cardMaxHeight,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={expanded}
        scrollEnabled={expanded}
      >
        <View style={styles.topRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.label}>AQI ACTUAL</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={[styles.status, { color: aqiStatus.color }]}>
              {aqiStatus.label}
            </Text>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.headerRow}>
              <View style={styles.zoneContent}>
                <Text style={styles.zoneLabel}>Zona seleccionada</Text>
                <Text style={styles.zoneTitle} numberOfLines={1}>
                  {title}
                </Text>
              </View>

              <View style={[styles.sourceBadge, { borderColor: sourceColor }]}>
                <Text style={styles.sourceLabel}>Fuente</Text>
                <Text style={[styles.sourceValue, { color: sourceColor }]}>
                  {getSourceLabel(source)}
                </Text>
              </View>
            </View>

            <Text
              style={styles.description}
              numberOfLines={expanded ? undefined : 2}
            >
              {aqiStatus.description}
            </Text>

            <Text
              style={styles.sourceDescription}
              numberOfLines={expanded ? 2 : 1}
            >
              {getSourceDescription(source)}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PM2.5</Text>
            <Text style={styles.metricValue}>{pm25}</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PM10</Text>
            <Text style={styles.metricValue}>{pm10}</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Temp.</Text>
            <Text style={styles.metricValue}>
              {hasWeather ? formatTemperature(weather?.temperature) : "--"}
            </Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.detailBox}>
            <Text style={styles.detailTitle}>Clima actual</Text>

            {hasWeather ? (
              <>
                <Text style={styles.weatherStatus}>
                  {weather?.weatherLabel}
                </Text>

                <View style={styles.weatherGrid}>
                  <View style={styles.weatherBox}>
                    <Text style={styles.weatherLabel}>Temperatura</Text>
                    <Text style={styles.weatherValue}>
                      {formatTemperature(weather?.temperature)}
                    </Text>
                  </View>

                  <View style={styles.weatherBox}>
                    <Text style={styles.weatherLabel}>Sensación</Text>
                    <Text style={styles.weatherValue}>
                      {formatTemperature(weather?.apparentTemperature)}
                    </Text>
                  </View>

                  <View style={styles.weatherBox}>
                    <Text style={styles.weatherLabel}>Humedad</Text>
                    <Text style={styles.weatherValue}>
                      {formatPercent(weather?.humidity)}
                    </Text>
                  </View>

                  <View style={styles.weatherBox}>
                    <Text style={styles.weatherLabel}>Viento</Text>
                    <Text style={styles.weatherValue}>
                      {formatWind(weather?.windSpeed)}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.weatherUnavailableBox}>
                <Text style={styles.weatherStatus}>
                  Clima temporalmente no disponible
                </Text>

                <Text style={styles.detailText}>
                  No pudimos obtener temperatura en este momento. El AQI sigue
                  funcionando correctamente para evaluar la calidad del aire.
                </Text>
              </View>
            )}

            <View style={styles.detailDivider} />

            <Text style={styles.detailTitle}>Recomendación para caminar</Text>
            <Text style={styles.detailText}>
              {getWalkingRecommendation(value)}
            </Text>

            <Text style={styles.detailText}>
              {getWeatherWalkingTip(weather)}
            </Text>

            <View style={styles.detailDivider} />

            <Text style={styles.detailTitle}>Interpretación</Text>
            <Text style={styles.detailText}>
              PM2.5 y PM10 son partículas en el aire. Mientras más alto sea el
              valor, mayor puede ser el impacto en personas sensibles o durante
              actividad física prolongada.
            </Text>
          </View>
        )}
      </ScrollView>

      <Pressable
        style={styles.detailButton}
        onPress={() => setExpanded((current) => !current)}
      >
        <Text style={styles.detailButtonText}>
          {expanded ? "Ocultar detalle" : "Ver detalle"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.96)",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    gap: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 18,
  },
  topRow: {
    flexDirection: "row",
    gap: 14,
  },
  leftColumn: {
    width: 86,
  },
  label: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  value: {
    color: "#f8fafc",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 42,
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  rightColumn: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  zoneContent: {
    flex: 1,
  },
  zoneLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  zoneTitle: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  sourceBadge: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 86,
    borderWidth: 1,
  },
  sourceLabel: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sourceValue: {
    fontSize: 11,
    fontWeight: "900",
    marginTop: 1,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  sourceDescription: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 9,
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
  },
  metricValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 1,
  },
  detailBox: {
    backgroundColor: "rgba(30, 41, 59, 0.72)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
  },
  detailTitle: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "900",
  },
  detailText: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  weatherStatus: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },
  weatherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  weatherBox: {
    width: "48%",
    backgroundColor: "rgba(15, 23, 42, 0.74)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 9,
  },
  weatherUnavailableBox: {
    backgroundColor: "rgba(15, 23, 42, 0.74)",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  weatherLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
  },
  weatherValue: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.18)",
    marginVertical: 10,
  },
  detailButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(14, 116, 144, 0.65)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 2,
  },
  detailButtonText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "900",
  },
});