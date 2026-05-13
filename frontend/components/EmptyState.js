import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon || '📭'}</Text>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.lg,
  },
  icon: { fontSize: 56, marginBottom: spacing.md },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
