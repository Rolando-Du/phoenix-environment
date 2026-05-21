import { View, Text, StyleSheet } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { SPACING } from '../theme/spacing';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Phoenix</Text>

        <Text style={styles.subtitle}>
          Monitoreo ambiental inteligente
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    color: COLORS.fire,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});