import { StyleSheet, Text, View } from 'react-native';

import { getAqiStatus } from '../utils/getAqiStatus';

type AqiCardProps = {
  title: string;
  value: number;
  pm25: number;
  pm10: number;
};

export default function AqiCard({ title, value, pm25, pm10 }: AqiCardProps) {
  const aqiStatus = getAqiStatus(value);

  return (
    <View style={styles.aqiCard}>
      <View>
        <Text style={styles.aqiLabel}>AQI ACTUAL</Text>
        <Text style={styles.aqiValue}>{value}</Text>
        <Text style={[styles.aqiStatus, { color: aqiStatus.color }]}>
          {aqiStatus.label}
        </Text>
      </View>

      <View style={styles.aqiInfo}>
        <View>
          <Text style={styles.zoneLabel}>Zona seleccionada</Text>
          <Text style={styles.zoneTitle}>{title}</Text>
          <Text style={styles.aqiDescription}>{aqiStatus.description}</Text>
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aqiCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    flexDirection: 'row',
    gap: 18,
  },
  aqiLabel: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  aqiValue: {
    color: '#f8fafc',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 54,
    marginTop: 4,
  },
  aqiStatus: {
    fontSize: 16,
    fontWeight: '800',
  },
  aqiInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  zoneLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  zoneTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 4,
  },
  aqiDescription: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 16,
    padding: 10,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
});