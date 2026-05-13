import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'userRole', 'username', 'userId', 'fullName']);
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.welcome}>Welcome, Admin</Text>
        <Text style={styles.desc}>Manage users, books, and borrowing records</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserList')}>
          <Text style={styles.icon}>👥</Text>
          <Text style={styles.cardTitle}>User Control</Text>
          <Text style={styles.cardDesc}>Add, edit, or remove library users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookList', { role: 'admin' })}>
          <Text style={styles.icon}>📚</Text>
          <Text style={styles.cardTitle}>Book Control</Text>
          <Text style={styles.cardDesc}>Manage all books in the library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BorrowList', { role: 'admin' })}>
          <Text style={styles.icon}>🔄</Text>
          <Text style={styles.cardTitle}>Borrow Records</Text>
          <Text style={styles.cardDesc}>View all borrowed books and returns</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddBook')}>
          <Text style={styles.icon}>➕</Text>
          <Text style={styles.cardTitle}>Quick Add Book</Text>
          <Text style={styles.cardDesc}>Add a new book to collection</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerCard: { backgroundColor: '#2c3e50', padding: 30, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  welcome: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  desc: { fontSize: 15, color: '#bdc3c7', marginTop: 5 },
  grid: { padding: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: 'white', width: '48%', padding: 20, borderRadius: 16, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  icon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  cardDesc: { fontSize: 12, color: '#7f8c8d', textAlign: 'center', marginTop: 4 },
  logoutBtn: { backgroundColor: '#e74c3c', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
