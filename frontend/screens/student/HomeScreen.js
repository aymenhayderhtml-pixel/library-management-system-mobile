import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  RefreshControl, TextInput, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { booksAPI } from '../../services/api';
import BookCard from '../../components/BookCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBooks = async (searchTerm = '') => {
    try {
      const { data } = await booksAPI.getAll(searchTerm);
      setBooks(data);
    } catch (err) {
      console.log('Error fetching books:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBooks(search);
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks(search);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📚 Library</Text>
        <Text style={styles.headerSub}>{books.length} books available</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, author, or category..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.searchIcon}>🔍</Text>
        )}
      </View>

      {/* Book List */}
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetail', { bookId: item._id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No books found"
            subtitle={search ? `No results for "${search}"` : 'The library is empty right now.'}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 12 },
  searchIcon: { fontSize: 16 },
  clearBtn: { fontSize: 14, color: colors.textMuted, paddingHorizontal: 4 },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
});
