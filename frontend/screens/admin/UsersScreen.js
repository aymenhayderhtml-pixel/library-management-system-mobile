import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usersAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await usersAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.log('Error fetching users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name?.[0]?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.date}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge]}>
        <Text style={[styles.roleText, item.role === 'admin' && styles.adminText]}>
          {item.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
        </Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.count}>{users.length} registered users</Text>}
        ListEmptyComponent={<EmptyState icon="👥" title="No users yet" />}
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
    marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', ...shadow.sm,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  email: { fontSize: 13, color: colors.textLight, marginTop: 1 },
  date: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  roleBadge: { backgroundColor: colors.safe, paddingVertical: 4, paddingHorizontal: 8, borderRadius: radius.full },
  adminBadge: { backgroundColor: colors.primaryLight },
  roleText: { fontSize: 11, color: colors.safeText, fontWeight: '600' },
  adminText: { color: colors.primary },
});
