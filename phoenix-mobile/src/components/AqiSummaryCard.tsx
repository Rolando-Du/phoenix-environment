import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AqiSummary } from '../services/aqiSummaryService';

type AqiSummaryCardProps = {
  summary: AqiSummary;
  onClose: () => void;
};

function formatValue(value: number | null) {
  return value === null ? '--' : String(value);
}

export default function AqiSummaryCard({
  summary,
  onClose,
}: AqiSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>RESUMEN AQI</Text>
          <Text style={styles.title}>Histórico ambiental</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.totalBox}>
          <Text style={styles.totalValue}>{summary.totalReadings}</Text>
          <Text style={styles.totalLabel}>lecturas</Text>
        </View>

        <View style={styles.metricsColumn}>
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Prom.</Text>
              <Text style={styles.metricValue}>
                {formatValue(summary.averageAqi)}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Máx.</Text>
              <Text style={styles.metricValue}>
                {formatValue(summary.maxAqi)}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Mín.</Text>
              <Text style={styles.metricValue}>
                {formatValue(summary.minAqi)}
              </Text>
            </View>
          </View>

          <Text style={styles.latest} numberOfLines={1}>
            Última zona: {summary.latestReading?.title ?? 'Sin registros'} · AQI{' '}
            {summary.latestReading?.value ?? '--'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  label: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
  },
  contentRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  totalBox: {
    width: 82,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
  },
  totalValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  metricsColumn: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
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
  latest: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 9,
  },
});