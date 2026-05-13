import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDashboardScreen({ navigation }) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const name = await AsyncStorage.getItem('fullName');
    setFullName(name || 'Student');
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['isLoggedIn', 'userRole', 'username', 'userId', 'fullName']);
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.welcome}>Hello, {fullName} 👋</Text>
        <Text style={styles.desc}>Browse books and manage your borrows</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookList', { role: 'user' })}>
          <Text style={styles.icon}>📖</Text>
          <Text style={styles.cardTitle}>Browse Books</Text>
          <Text style={styles.cardDesc}>View available books and borrow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BorrowList', { role: 'user' })}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.cardTitle}>My Borrows</Text>
          <Text style={styles.cardDesc}>Books you have borrowed</Text>
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
  headerCard: { backgroundColor: '#3498db', padding: 30, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  welcome: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  desc: { fontSize: 15, color: '#ecf0f1', marginTop: 5 },
  grid: { padding: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: 'white', width: '48%', padding: 20, borderRadius: 16, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  icon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  cardDesc: { fontSize: 12, color: '#7f8c8d', textAlign: 'center', marginTop: 4 },
  logoutBtn: { backgroundColor: '#e74c3c', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
