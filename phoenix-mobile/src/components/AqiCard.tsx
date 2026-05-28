import { StyleSheet, Text, View } from 'react-native';

import type { AqiSource } from '../services/aqiService';
import { getAqiStatus } from '../utils/getAqiStatus';

type AqiCardProps = {
  title: string;
  value: number;
  pm25: number;
  pm10: number;
  source: AqiSource;
};

function getSourceLabel(source: AqiSource) {
  if (source === 'openaq') {
    return 'OpenAQ';
  }

  return 'Mock temporal';
}

export default function AqiCard({
  title,
  value,
  pm25,
  pm10,
  source,
}: AqiCardProps) {
  const aqiStatus = getAqiStatus(value);

  return (
    <View style={styles.card}>
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

          <View style={styles.sourceBadge}>
            <Text style={styles.sourceLabel}>Fuente</Text>
            <Text style={styles.sourceValue}>{getSourceLabel(source)}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {aqiStatus.description}
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PM2.5</Text>
            <Text style={styles.metricValue}>{pm25}</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>PM10</Text>
            <Text style={styles.metricValue}>{pm10}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    flexDirection: 'row',
    gap: 14,
  },
  leftColumn: {
    width: 86,
  },
  label: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  value: {
    color: '#f8fafc',
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 42,
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  rightColumn: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  zoneContent: {
    flex: 1,
  },
  zoneLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  zoneTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  sourceBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 76,
  },
  sourceLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sourceValue: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 1,
  },
  description: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 9,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
});