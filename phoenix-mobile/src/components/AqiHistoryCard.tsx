import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AqiHistoryItem } from '../services/aqiHistoryService';

type AqiHistoryCardProps = {
  history: AqiHistoryItem[];
  source: 'mock' | 'openaq' | 'all';
  onClose: () => void;
};

function getSourceLabel(source: AqiHistoryCardProps['source']) {
  if (source === 'openaq') return 'OpenAQ real';
  if (source === 'mock') return 'Mock temporal';

  return 'Mixto';
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AqiHistoryCard({
  history,
  source,
  onClose,
}: AqiHistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>HISTORIAL AQI</Text>
          <Text style={styles.title}>{getSourceLabel(source)}</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>Sin registros disponibles.</Text>
        ) : (
          history.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.zone} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {formatTime(item.recordedAt)} · {item.source}
                </Text>
              </View>

              <View style={styles.aqiBox}>
                <Text style={styles.aqiLabel}>AQI</Text>
                <Text style={styles.aqiValue}>{item.value}</Text>
              </View>
            </View>
          ))
        )}
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
    width: 32,
    height: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  list: {
    marginTop: 12,
    gap: 8,
  },
  row: {
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  zone: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '900',
  },
  meta: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  aqiBox: {
    minWidth: 52,
    alignItems: 'center',
  },
  aqiLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
  },
  aqiValue: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 1,
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
});