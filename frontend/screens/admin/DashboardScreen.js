import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { booksAPI, usersAPI, borrowAPI } from '../../services/api';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ books: 0, users: 0, borrows: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [booksRes, usersRes, borrowsRes] = await Promise.all([
        booksAPI.getAll(),
        usersAPI.getAll(),
        borrowAPI.history(),
      ]);
      setStats({
        books: booksRes.data.length,
        users: usersRes.data.length,
        borrows: borrowsRes.data.filter((b) => b.status === 'borrowed').length,
      });
    } catch (err) {
      console.log('Dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, bg }) => (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSub}>Library overview</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard icon="📚" label="Total Books" value={stats.books} bg="#EFF6FF" />
            <StatCard icon="👥" label="Students" value={stats.users} bg="#ECFDF5" />
            <StatCard icon="🔄" label="Active Borrows" value={stats.borrows} bg="#FEF3C7" />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {[
                { icon: '➕', label: 'Add Book', screen: 'AddBook' },
                { icon: '📋', label: 'Manage Books', screen: 'ManageBooks' },
                { icon: '👥', label: 'View Users', screen: 'Users' },
                { icon: '📊', label: 'Borrow Records', screen: 'BorrowRecords' },
              ].map((action) => (
                <View key={action.screen} style={styles.actionCard}>
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statsGrid: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textLight, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
});
