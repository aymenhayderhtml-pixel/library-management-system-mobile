import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_URL } from '../config';

export default function AddUserScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async () => {
    if (!username || !password || !fullName) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName, email, role })
      });

      if (response.ok) {
        Alert.alert('Success', 'User created successfully');
        navigation.goBack();
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to create user');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Add New User</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Username *</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>Password *</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleBtn, role === 'user' && styles.roleActive]} onPress={() => setRole('user')}>
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, role === 'admin' && styles.roleActive]} onPress={() => setRole('admin')}>
            <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', margin: 15, padding: 20, borderRadius: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  roleContainer: { flexDirection: 'row', marginBottom: 10 },
  roleBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8, marginHorizontal: 4, backgroundColor: '#ecf0f1' },
  roleActive: { backgroundColor: '#3498db' },
  roleText: { fontWeight: '600', color: '#7f8c8d' },
  roleTextActive: { color: 'white' },
  button: { backgroundColor: '#27ae60', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
