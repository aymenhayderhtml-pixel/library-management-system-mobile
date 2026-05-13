import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    fetchUsers();
    return unsubscribe;
  }, [navigation]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, username) => {
    // Prevent deleting the main admin
    if (username === 'admin') {
      Alert.alert('Not Allowed', 'Cannot delete the default admin account');
      return;
    }

    Alert.alert('Confirm Delete', `Delete user ${username}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
          if (response.ok) {
            Alert.alert('Deleted', 'User removed successfully');
            fetchUsers();
          } else {
            Alert.alert('Error', 'Failed to delete user');
          }
        } catch (err) {
          Alert.alert('Error', err.message);
        }
      }}
    ]);
  };

  const renderUser = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.detail}>@{item.username} • {item.role}</Text>
        <Text style={styles.detail}>{item.email || 'No email'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.editBtn]} 
          onPress={() => navigation.navigate('EditUser', { user: item })}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, styles.deleteBtn]} 
          onPress={() => handleDelete(item._id, item.username)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.addBtnText}>➕ Add New User</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.center}>Loading users...</Text>
      ) : users.length === 0 ? (
        <Text style={styles.center}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
  addBtn: { backgroundColor: '#27ae60', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  center: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' },
  list: { paddingBottom: 20 },
  item: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  info: { marginBottom: 10 },
  name: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50' },
  detail: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  editBtn: { backgroundColor: '#f39c12' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: 'white', fontWeight: '600', fontSize: 13 },
});
