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

      <View style={styles.totalBox}>
        <Text style={styles.totalValue}>{summary.totalReadings}</Text>
        <Text style={styles.totalLabel}>lecturas registradas</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Promedio</Text>
          <Text style={styles.metricValue}>
            {formatValue(summary.averageAqi)}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Máximo</Text>
          <Text style={styles.metricValue}>{formatValue(summary.maxAqi)}</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Mínimo</Text>
          <Text style={styles.metricValue}>{formatValue(summary.minAqi)}</Text>
        </View>
      </View>

      <View style={styles.latestBox}>
        <Text style={styles.latestLabel}>Última zona registrada</Text>
        <Text style={styles.latestTitle}>
          {summary.latestReading?.title ?? 'Sin registros'}
        </Text>
        <Text style={styles.latestDescription}>
          AQI {summary.latestReading?.value ?? '--'} · Fuente{' '}
          {summary.latestReading?.source ?? '--'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderRadius: 28,
    padding: 18,
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },
  closeButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  totalBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
  },
  totalValue: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
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
  latestBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.18)',
    paddingTop: 12,
  },
  latestLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  latestTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  latestDescription: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
});