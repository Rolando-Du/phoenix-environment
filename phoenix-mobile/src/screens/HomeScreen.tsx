import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { SPACING } from '../theme/spacing';

const clearZoneLogo = require('../../assets/logo-CZ.png');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={clearZoneLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: COLORS.secondary }]}>CLEAR</Text>
          <Text style={[styles.title, { color: COLORS.success }]}>ZONE</Text>
        </View>

        <Text style={styles.subtitle}>
          Aire y clima en tiempo real para moverte mejor.
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

  logo: {
    width: 96,
    height: 96,
    marginBottom: SPACING.md,
    borderRadius: 24,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '900',
  },

  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});