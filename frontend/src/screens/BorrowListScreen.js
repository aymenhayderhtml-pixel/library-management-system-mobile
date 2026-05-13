import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

export default function BorrowListScreen({ route }) {
  const screenRole = route.params?.role || 'user';
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

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
            Alert.alert('✅ Success', 'Book returned successfully');
            fetchBorrows(userId);
          } else {
            Alert.alert('❌ Error', 'Failed to return book');
          }
        } catch (err) {
          Alert.alert('❌ Error', err.message);
        }
      }}
    ]);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getDueStatus = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0)  return { label: 'Overdue',       color: '#e74c3c' };
    if (daysLeft <= 3) return { label: `Due in ${daysLeft}d`, color: '#e67e22' };
    return              { label: `Due in ${daysLeft}d`, color: '#27ae60' };
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
          {item.dueDate && (
            <Text style={styles.detail}>⏰ Due: {formatDate(item.dueDate)}</Text>
          )}
          {status && (
            <View style={[styles.badge, { backgroundColor: status.color }]}>
              <Text style={styles.badgeText}>{status.label}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(item._id)}>
          <Text style={styles.returnText}>Return</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {screenRole === 'admin' ? 'All Borrow Records' : 'My Borrowed Books'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 50 }} />
      ) : borrows.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.center}>
            {screenRole === 'admin' ? 'No borrow records yet' : 'You have no borrowed books'}
          </Text>
        </View>
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
  container:      { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
  header:         { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginTop: 10 },
  center:         { textAlign: 'center', fontSize: 16, color: '#7f8c8d', marginTop: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon:      { fontSize: 48, marginBottom: 10 },
  list:           { paddingBottom: 20 },
  item:           { backgroundColor: 'white', padding: 16, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  info:           { flex: 1 },
  bookTitle:      { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  detail:         { fontSize: 13, color: '#7f8c8d', marginTop: 3 },
  badge:          { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 6 },
  badgeText:      { color: 'white', fontSize: 12, fontWeight: 'bold' },
  returnBtn:      { backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginLeft: 10 },
  returnText:     { color: 'white', fontWeight: '600' },
});
