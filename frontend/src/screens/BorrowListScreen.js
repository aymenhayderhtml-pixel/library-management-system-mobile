import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function BorrowListScreen({ route }) {
  const screenRole = route.params?.role || 'user';
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const uid = await AsyncStorage.getItem('userId');
    setUserId(uid || '');
    fetchBorrows(uid || '');
  };

  const fetchBorrows = async (uid) => {
    try {
      setLoading(true);
      const url = screenRole === 'admin' 
        ? `${API_URL}/borrows` 
        : `${API_URL}/borrows?userId=${uid}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setBorrows(data);
    } catch (error) {
      Alert.alert('Error ❌', 'Failed to load borrow records');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (id, bookTitle) => {
    Alert.alert(
      'Return Book',
      `Are you sure you want to return "${bookTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Return', 
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/borrows/${id}`, { method: 'DELETE' });
              if (response.ok) {
                Alert.alert('Returned ✅', `"${bookTitle}" returned successfully`);
                fetchBorrows(userId);
              } else {
                Alert.alert('Error ❌', 'Failed to return book');
              }
            } catch (err) {
              Alert.alert('Error ❌', err.message);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // NEW: Check overdue status and return color
  const getDueStatus = (dueDateString) => {
    const due = new Date(dueDateString);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: '#e74c3c', bg: '#fdecea' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: '#f39c12', bg: '#fef5e7' };
    return { text: `${diffDays} days left`, color: '#27ae60', bg: '#e9f7ef' };
  };

  const renderBorrow = ({ item }) => {
    const status = getDueStatus(item.dueDate);
    
    return (
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.bookTitle}>📖 {item.bookTitle}</Text>
          {screenRole === 'admin' && (
            <Text style={styles.detail}>👤 {item.studentName}</Text>
          )}
          <Text style={styles.detail}>📅 Borrowed: {formatDate(item.borrowDate)}</Text>
          
          {/* NEW: Due date with color indicator */}
          <View style={[styles.dueBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.dueText, { color: status.color }]}>
              ⏰ Due: {formatDate(item.dueDate)} ({status.text})
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.returnBtn} 
          onPress={() => handleReturn(item._id, item.bookTitle)}
        >
          <Text style={styles.returnText}>Return</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {screenRole === 'admin' ? '🔄 All Borrow Records' : '📋 My Borrowed Books'}
      </Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      )}

      {!loading && borrows.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>
            {screenRole === 'admin' ? 'No borrow records found' : 'You have no borrowed books'}
          </Text>
        </View>
      )}

      {!loading && borrows.length > 0 && (
        <FlatList
          data={borrows}
          keyExtractor={(item) => item._id}
          renderItem={renderBorrow}
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
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    elevation: 3 
  },
  info: { flex: 1, marginRight: 10 },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  detail: { fontSize: 13, color: '#7f8c8d', marginTop: 3 },
  
  // Due date badge
  dueBadge: { 
    alignSelf: 'flex-start', 
    marginTop: 8, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 20 
  },
  dueText: { fontSize: 12, fontWeight: 'bold' },
  
  returnBtn: { backgroundColor: '#3498db', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  returnText: { color: 'white', fontWeight: '600', fontSize: 14 },
});
