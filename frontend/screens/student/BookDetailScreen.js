import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, Alert, ActivityIndicator,
} from 'react-native';
import { booksAPI, borrowAPI } from '../../services/api';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const { data } = await booksAPI.getOne(bookId);
      setBook(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load book details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    Alert.alert(
      'Borrow Book',
      `Borrow "${book.title}"? You'll have 14 days to return it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Borrow',
          onPress: async () => {
            try {
              setBorrowing(true);
              await borrowAPI.borrow(book._id);
              Alert.alert('✅ Success', 'Book borrowed! Return within 14 days.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('❌ Error', err.response?.data?.message || 'Failed to borrow book');
            } finally {
              setBorrowing(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cover Image */}
      <View style={styles.imageWrapper}>
        {book.image ? (
          <Image source={{ uri: book.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>📖</Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{book.category}</Text>
          </View>
          <View style={[styles.badge, !isAvailable && styles.badgeDanger]}>
            <Text style={[styles.badgeText, !isAvailable && styles.badgeDangerText]}>
              {isAvailable ? `${book.availableCopies}/${book.totalCopies} available` : 'Unavailable'}
            </Text>
          </View>
        </View>

        {book.isbn ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ISBN</Text>
            <Text style={styles.infoValue}>{book.isbn}</Text>
          </View>
        ) : null}

        {book.description ? (
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>Description</Text>
            <Text style={styles.descText}>{book.description}</Text>
          </View>
        ) : null}

        <CustomButton
          title={isAvailable ? '📥 Borrow This Book' : 'Not Available'}
          onPress={handleBorrow}
          loading={borrowing}
          style={{ marginTop: spacing.lg }}
          variant={isAvailable ? 'primary' : 'outline'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: { backgroundColor: colors.primaryLight, alignItems: 'center', paddingVertical: 32 },
  image: { width: 140, height: 200, borderRadius: radius.md },
  imagePlaceholder: {
    width: 140, height: 200, borderRadius: radius.md,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadow.sm,
  },
  placeholderEmoji: { fontSize: 60 },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 6 },
  author: { fontSize: 15, color: colors.textLight, marginBottom: spacing.md },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md, flexWrap: 'wrap' },
  badge: { backgroundColor: colors.primaryLight, paddingVertical: 5, paddingHorizontal: 12, borderRadius: radius.full },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  badgeDanger: { backgroundColor: colors.overdue },
  badgeDangerText: { color: colors.overdueText },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: 13, color: colors.textLight, fontWeight: '600' },
  infoValue: { fontSize: 13, color: colors.text },
  descBox: { marginTop: spacing.md },
  descLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 },
  descText: { fontSize: 14, color: colors.textLight, lineHeight: 22 },
});
