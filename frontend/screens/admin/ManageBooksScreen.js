import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { booksAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function ManageBooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [])
  );

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await booksAPI.getAll();
      setBooks(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (book) => {
    Alert.alert('Delete Book', `Delete "${book.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(book._id);
            await booksAPI.delete(book._id);
            fetchBooks();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete');
          } finally {
            setDeleting(null);
          }
        },
      },
    ]);
  };

  const renderBook = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
        <Text style={styles.meta}>
          📂 {item.category} · {item.availableCopies}/{item.totalCopies} copies
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditBook', { book: item })}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
          disabled={deleting === item._id}
        >
          {deleting === item._id ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.deleteText}>Del</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderBook}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.count}>{books.length} books in library</Text>
        }
        ListEmptyComponent={
          <EmptyState icon="📚" title="No books yet" subtitle="Add books from the Add Book tab." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  count: { fontSize: 13, color: colors.textLight, marginBottom: spacing.sm, marginTop: spacing.sm },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.sm,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  author: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 6 },
  editBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  editText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  deleteBtn: {
    backgroundColor: colors.danger,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: radius.sm,
    minWidth: 42, alignItems: 'center',
  },
  deleteText: { color: colors.white, fontWeight: '700', fontSize: 13 },
});
