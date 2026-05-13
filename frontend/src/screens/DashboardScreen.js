import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    // Replace so user can't go back to Dashboard
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome to Library System</Text>
      <Text style={styles.subheader}>Manage your university library</Text>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('BookList')}
      >
        <Text style={styles.cardTitle}>📖 View Books</Text>
        <Text style={styles.cardDesc}>See all books, edit, delete, or borrow</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={styles.cardTitle}>➕ Add Book</Text>
        <Text style={styles.cardDesc}>Add new books to the library</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('BorrowList')}
      >
        <Text style={styles.cardTitle}>🔄 Borrowed Books</Text>
        <Text style={styles.cardDesc}>View and return borrowed books</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    marginTop: 20,
  },
  subheader: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
