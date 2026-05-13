import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Alert, TextInput, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function BookListScreen({ route, navigation }) {
  const screenRole = route.params?.role || 'user';
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // NEW: for search
  const [search, setSearch] = useState('');               // NEW: search text
  const [loading, setLoading] = useState(true);           // NEW: proper loading
  const [userRole, setUserRole] = useState('user');
  const [userId, setUserId] = useState('');
  const [borrowBookId, setBorrowBookId] = useState(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadUserData();
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    fetchBooks();
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    const role = await AsyncStorage.getItem('userRole');
    const uid = await AsyncStorage.getItem('userId');
    const name = await AsyncStorage.getItem('fullName');
    setUserRole(role || 'user');
    setUserId(uid || '');
    if (name) setStudentName(name);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data); // NEW: init filtered list
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch books from server');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Search filter logic
  useEffect(() => {
    const results = books.filter(b => 
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(results);
  }, [search, books]);

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
              if (response.ok) {
                Alert.alert('Deleted ✅', `"${title}" removed successfully`);
                fetchBooks();
              } else {
                Alert.alert('Error ❌', 'Failed to delete book');
              }
            } catch (err) {
              Alert.alert('Error ❌', err.message);
            }
          }
        }
      ]
    );
  };

  const startBorrow = (bookId) => {
    setBorrowBookId(bookId);
    AsyncStorage.getItem('fullName').then(name => {
      if (name) setStudentName(name);
    });
  };

  const cancelBorrow = () => {
    setBorrowBookId(null);
    AsyncStorage.getItem('fullName').then(name => setStudentName(name || ''));
  };

  const confirmBorrow = async () => {
    if (!studentName.trim()) {
      Alert.alert('Missing Info', 'Please enter your name');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/borrows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, bookId: borrowBookId, userId })
      });

      if (response.ok) {
        Alert.alert('Success ✅', 'Book borrowed! Return within 14 days.');
        setBorrowBookId(null);
        fetchBooks();
      } else {
        const data = await response.json();
        Alert.alert('Error ❌', data.message || 'Failed to borrow');
      }
    } catch (err) {
      Alert.alert('Error ❌', err.message);
    }
  };

  const isAdmin = userRole === 'admin';

  const renderBook = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>✍️ {item.author}</Text>
        <Text style={styles.detail}>🏷️ {item.category}</Text>
        
        {/* NEW: Book count badge with color */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, item.quantity > 0 ? styles.badgeGreen : styles.badgeRed]}>
            <Text style={styles.badgeText}>
              {item.quantity > 0 ? `${item.quantity} Available` : 'Out of Stock'}
            </Text>
          </View>
        </View>
      </View>

      {borrowBookId === item._id ? (
        <View style={styles.borrowForm}>
          <TextInput
            style={styles.borrowInput}
            placeholder="Enter your full name"
            value={studentName}
            onChangeText={setStudentName}
          />
          <View style={styles.borrowActions}>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmBorrow}>
              <Text style={styles.btnText}>✓ Confirm Borrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelBorrow}>
              <Text style={styles.btnText}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          {isAdmin && (
            <>
              <TouchableOpacity 
                style={[styles.btn, styles.editBtn]} 
                onPress={() => navigation.navigate('EditBook', { id: item._id })}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.deleteBtn]} 
                onPress={() => handleDelete(item._id, item.title)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={[
              styles.btn, 
              styles.borrowBtn, 
              item.quantity <= 0 && styles.disabledBtn
            ]} 
            onPress={() => startBorrow(item._id)}
            disabled={item.quantity <= 0}
          >
            <Text style={styles.btnText}>
              {item.quantity <= 0 ? 'Unavailable' : 'Borrow'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isAdmin ? '📚 Library Inventory' : '📖 Browse Books'}
      </Text>

      {/* NEW: Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search by title, author, or category..."
        value={search}
        onChangeText={setSearch}
      />

      {isAdmin && (
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBook')}>
          <Text style={styles.addBtnText}>➕ Add New Book</Text>
        </TouchableOpacity>
      )}

      {/* NEW: Loading spinner */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      )}

      {/* NEW: Empty state */}
      {!loading && filteredBooks.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>
            {search ? 'No books match your search' : 'No books in the library yet'}
          </Text>
        </View>
      )}

      {!loading && filteredBooks.length > 0 && (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item._id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginTop: 10 },
  
  // Search bar styles
  searchInput: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#2c3e50'
  },
  
  addBtn: { backgroundColor: '#27ae60', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  
  center: { alignItems: 'center', marginTop: 60 },
  loadingText: { marginTop: 10, color: '#7f8c8d', fontSize: 15 },
  emptyEmoji: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center' },
  
  list: { paddingBottom: 30 },
  item: { 
    backgroundColor: 'white', 
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 14, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    elevation: 3 
  },
  info: { marginBottom: 12 },
  title: { fontSize: 19, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  detail: { fontSize: 14, color: '#555', marginTop: 3 },
  
  // Badge styles
  badgeRow: { flexDirection: 'row', marginTop: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  badgeGreen: { backgroundColor: '#d4edda' },
  badgeRed: { backgroundColor: '#f8d7da' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  btn: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 8, marginLeft: 6 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  borrowBtn: { backgroundColor: '#27ae60' },
  disabledBtn: { backgroundColor: '#bdc3c7' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 13 },
  
  borrowForm: { marginTop: 10, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12 },
  borrowInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 10, 
    fontSize: 15, 
    backgroundColor: 'white' 
  },
  borrowActions: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmBtn: { flex: 1, backgroundColor: '#27ae60', padding: 12, borderRadius: 10, marginRight: 5, alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#95a5a6', padding: 12, borderRadius: 10, marginLeft: 5, alignItems: 'center' },
});
