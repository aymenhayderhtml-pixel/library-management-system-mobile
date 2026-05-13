import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      // If admin, fetch all. If user, fetch only theirs.
      const url = screenRole === 'admin' 
        ? `${API_URL}/borrows` 
        : `${API_URL}/borrows?userId=${uid}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setBorrows(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (id) => {
    Alert.alert('Confirm Return', 'Return this book?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Return', onPress: async () => {
        try {
          const response = await fetch(`${API_URL}/borrows/${id}`, { method: 'DELETE' });
          if (response.ok) {
            Alert.alert('Success', 'Book returned');
            fetchBorrows(userId);
          } else {
            Alert.alert('Error', 'Failed to return');
          }
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }}
    ]);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const renderBorrow = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.bookTitle}>📖 {item.bookTitle}</Text>
        {screenRole === 'admin' && (
          <Text style={styles.detail}>👤 {item.studentName}</Text>
        )}
        <Text style={styles.detail}>📅 {formatDate(item.borrowDate)}</Text>
      </View>
      <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(item._id)}>
        <Text style={styles.returnText}>Return</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {screenRole === 'admin' ? 'All Borrow Records' : 'My Borrowed Books'}
      </Text>

      {loading ? (
        <Text style={styles.center}>Loading...</Text>
      ) : borrows.length === 0 ? (
        <Text style={styles.center}>
          {screenRole === 'admin' ? 'No borrow records' : 'You have no borrowed books'}
        </Text>
      ) : (
        <FlatList
          data={borrows}
          keyExtractor={(item) => item._id}
          renderItem={renderBorrow}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginTop: 10 },
  center: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' },
  list: { paddingBottom: 20 },
  item: { backgroundColor: 'white', padding: 16, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  info: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  detail: { fontSize: 13, color: '#7f8c8d', marginTop: 3 },
  returnBtn: { backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  returnText: { color: 'white', fontWeight: '600' },
});
