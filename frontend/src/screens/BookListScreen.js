import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Alert, TextInput 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function BookListScreen({ route, navigation }) {
  // role passed from navigation params, or default to user
  const screenRole = route.params?.role || 'user';
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
          if (response.ok) { Alert.alert('Deleted'); fetchBooks(); }
          else Alert.alert('Error', 'Failed to delete');
        } catch (err) { Alert.alert('Error', err.message); }
      }}
    ]);
  };

  const startBorrow = (bookId) => {
    setBorrowBookId(bookId);
    // Pre-fill with user's name if available
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
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/borrows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, bookId: borrowBookId, userId })
      });

      if (response.ok) {
        Alert.alert('Success', `You borrowed a book!`);
        setBorrowBookId(null);
        fetchBooks();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to borrow');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const isAdmin = userRole === 'admin';

  const renderBook = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>✍️ {item.author}</Text>
        <Text style={styles.detail}>🏷️ {item.category}</Text>
        <Text style={[styles.detail, item.quantity <= 0 && styles.outOfStock]}>
          📦 {item.quantity} available
        </Text>
      </View>

      {borrowBookId === item._id ? (
        <View style={styles.borrowForm}>
          <TextInput
            style={styles.borrowInput}
            placeholder="Your name"
            value={studentName}
            onChangeText={setStudentName}
          />
          <View style={styles.borrowActions}>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmBorrow}>
              <Text style={styles.btnText}>✓ Confirm</Text>
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
              <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => navigation.navigate('EditBook', { id: item._id })}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={[styles.btn, styles.borrowBtn, item.quantity <= 0 && styles.disabledBtn]} 
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
      <Text style={styles.header}>{isAdmin ? 'All Books (Admin)' : 'Browse Books'}</Text>
      
      {isAdmin && (
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddBook')}>
          <Text style={styles.addBtnText}>➕ Add New Book</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <Text style={styles.center}>Loading...</Text>
      ) : books.length === 0 ? (
        <Text style={styles.center}>No books available</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={renderBook}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginTop: 10 },
  addBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  center: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' },
  list: { paddingBottom: 20 },
  item: { backgroundColor: 'white', padding: 16, borderRadius: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  info: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  detail: { fontSize: 14, color: '#555', marginTop: 3 },
  outOfStock: { color: '#e74c3c', fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginLeft: 6 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  borrowBtn: { backgroundColor: '#27ae60' },
  disabledBtn: { backgroundColor: '#95a5a6' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 13 },
  borrowForm: { marginTop: 8 },
  borrowInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 15, backgroundColor: '#fafafa' },
  borrowActions: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmBtn: { flex: 1, backgroundColor: '#27ae60', padding: 10, borderRadius: 8, marginRight: 4, alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#7f8c8d', padding: 10, borderRadius: 8, marginLeft: 4, alignItems: 'center' },
});
