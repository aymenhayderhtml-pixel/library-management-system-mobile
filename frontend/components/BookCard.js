import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../styles/theme';

export default function BookCard({ book, onPress }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Book cover or placeholder */}
      <View style={styles.imageWrapper}>
        {book.image ? (
          <Image source={{ uri: book.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>📖</Text>
          </View>
        )}
      </View>

      {/* Book info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>by {book.author}</Text>

        <View style={styles.row}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{book.category}</Text>
          </View>
          <View style={[styles.availBadge, !isAvailable && styles.unavailBadge]}>
            <Text style={[styles.availText, !isAvailable && styles.unavailText]}>
              {isAvailable ? `${book.availableCopies} available` : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadow.md,
  },
  imageWrapper: { marginRight: spacing.md },
  image: { width: 70, height: 95, borderRadius: radius.sm },
  imagePlaceholder: {
    width: 70,
    height: 95,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 30 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  author: { fontSize: 13, color: colors.textLight, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.full,
  },
  categoryText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  availBadge: {
    backgroundColor: colors.safe,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.full,
  },
  unavailBadge: { backgroundColor: colors.overdue },
  availText: { fontSize: 11, color: colors.safeText, fontWeight: '600' },
  unavailText: { color: colors.overdueText },
});
