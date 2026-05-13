import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { borrowAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function BorrowedBooksScreen() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchBorrows();
    }, [])
  );

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const { data } = await borrowAPI.history();
      // Only show currently borrowed (not returned)
      setBorrows(data.filter((b) => b.status === 'borrowed'));
    } catch (err) {
      console.log('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (borrow) => {
    Alert.alert(
      'Return Book',
      `Return "${borrow.bookId?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return',
          onPress: async () => {
            try {
              setReturning(borrow._id);
              await borrowAPI.return(borrow._id);
              Alert.alert('✅ Returned', 'Book returned successfully!');
              fetchBorrows();
            } catch (err) {
              Alert.alert('❌ Error', err.response?.data?.message || 'Failed to return');
            } finally {
              setReturning(null);
            }
          },
        },
      ]
    );
  };

  const getDueStatus = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { label: `Overdue by ${Math.abs(daysLeft)}d`, color: colors.overdueText, bg: colors.overdue };
    if (daysLeft <= 3) return { label: `Due in ${daysLeft}d`, color: '#92400E', bg: '#FEF3C7' };
    return { label: `${daysLeft} days left`, color: colors.safeText, bg: colors.safe };
  };

  const renderItem = ({ item }) => {
    const status = getDueStatus(item.dueDate);
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.bookId?.title || 'Unknown Book'}
          </Text>
          <Text style={styles.bookAuthor}>by {item.bookId?.author || '—'}</Text>
          <Text style={styles.meta}>
            📅 Borrowed: {new Date(item.borrowDate).toLocaleDateString()}
          </Text>
          <Text style={styles.meta}>
            ⏰ Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => handleReturn(item)}
          disabled={returning === item._id}
        >
          {returning === item._id ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.returnText}>Return</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>My Borrowed Books</Text>
        <Text style={styles.headerSub}>{borrows.length} active</Text>
      </View>
      <FlatList
        data={borrows}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="📚"
            title="No borrowed books"
            subtitle="Go to the library tab to borrow a book!"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow.md,
  },
  cardContent: { flex: 1, marginRight: spacing.sm },
  bookTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  bookAuthor: { fontSize: 13, color: colors.textLight, marginTop: 2, marginBottom: 6 },
  meta: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  statusBadge: {
    alignSelf: 'flex-start', marginTop: 8,
    paddingVertical: 3, paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  returnBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: radius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  returnText: { color: colors.white, fontWeight: '600', fontSize: 13 },
});
