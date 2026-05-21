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
        <View>
          <Text style={[styles.label, { color: alertColor }]}>
            ALERTA {getAlertLabel(alert.level)}
          </Text>
          <Text style={styles.title}>{alert.title}</Text>
        </View>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </View>

      <Text style={styles.message}>{alert.message}</Text>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Estado</Text>
        <Text style={styles.footerValue}>
          {alert.active ? 'Activa' : 'Sin riesgo actual'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>AQI máximo</Text>
        <Text style={styles.footerValue}>{alert.maxAqi ?? '--'}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    maxWidth: 210,
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
  message: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  footer: {
    marginTop: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 16,
    padding: 10,
  },
  footerLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  footerValue: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
});