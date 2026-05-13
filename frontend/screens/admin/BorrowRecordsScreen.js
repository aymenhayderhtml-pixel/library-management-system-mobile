import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { borrowAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function BorrowRecordsScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecords();
    }, [])
  );

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await borrowAPI.history();
      setRecords(data);
    } catch (err) {
      console.log('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDueStatus = (dueDate, status) => {
    if (status === 'returned') return { label: '✅ Returned', color: colors.safeText, bg: colors.safe };
    const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { label: `Overdue ${Math.abs(daysLeft)}d`, color: colors.overdueText, bg: colors.overdue };
    if (daysLeft <= 3) return { label: `Due in ${daysLeft}d`, color: '#92400E', bg: '#FEF3C7' };
    return { label: `${daysLeft}d left`, color: colors.safeText, bg: colors.safe };
  };

  const renderRecord = ({ item }) => {
    const st = getDueStatus(item.dueDate, item.status);
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.bookId?.title || 'Unknown'}</Text>
          <Text style={styles.studentName}>👤 {item.userId?.name || 'Unknown'}</Text>
          <Text style={styles.meta}>📅 {new Date(item.borrowDate).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: st.bg }]}>
          <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        renderItem={renderRecord}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.count}>{records.length} total borrow records</Text>}
        ListEmptyComponent={<EmptyState icon="📋" title="No borrow records" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  count: { fontSize: 13, color: colors.textLight, marginBottom: spacing.sm, marginTop: spacing.sm },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md,
    marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', ...shadow.sm,
  },
  info: { flex: 1, marginRight: spacing.sm },
  bookTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  studentName: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
