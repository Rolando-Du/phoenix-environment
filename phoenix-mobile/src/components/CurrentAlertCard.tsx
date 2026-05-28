import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CurrentAlert } from '../services/alertService';

type CurrentAlertCardProps = {
  alert: CurrentAlert;
  onClose: () => void;
};

function getAlertColor(level: CurrentAlert['level']) {
  if (level === 'critical') return '#ef4444';
  if (level === 'danger') return '#f97316';
  if (level === 'warning') return '#eab308';

  return '#38bdf8';
}

function getAlertLabel(level: CurrentAlert['level']) {
  if (level === 'critical') return 'CRÍTICA';
  if (level === 'danger') return 'ALTA';
  if (level === 'warning') return 'MODERADA';

  return 'INFO';
}

export default function CurrentAlertCard({
  alert,
  onClose,
}: CurrentAlertCardProps) {
  const alertColor = getAlertColor(alert.level);

  return (
    <View style={[styles.card, { borderColor: alertColor }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.label, { color: alertColor }]}>
            ALERTA {getAlertLabel(alert.level)}
          </Text>

          <Text style={styles.title} numberOfLines={1}>
            {alert.title}
          </Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {alert.message}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.footerBox}>
          <Text style={styles.footerLabel}>Estado</Text>
          <Text style={styles.footerValue}>
            {alert.active ? 'Activa' : 'Sin riesgo'}
          </Text>
        </View>

        <View style={styles.footerBox}>
          <Text style={styles.footerLabel}>AQI máximo</Text>
          <Text style={styles.footerValue}>{alert.maxAqi ?? '--'}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  closeButton: {
    width: 34,
    height: 34,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  message: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  footerBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 9,
  },
  footerLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
  },
  footerValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1,
  },
});