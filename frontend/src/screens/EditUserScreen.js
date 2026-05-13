import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_URL } from '../config';

export default function EditUserScreen({ route, navigation }) {
  const { user } = route.params;
  
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    try {
      const body = { fullName, email, role };
      if (password) body.password = password; // only send if changed

      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        Alert.alert('Success', 'User updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update user');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Edit User</Text>
        <Text style={styles.sub}>@{user.username}</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>New Password (leave blank to keep current)</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••" />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleBtn, role === 'user' && styles.roleActive]} onPress={() => setRole('user')}>
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleBtn, role === 'admin' && styles.roleActive]} onPress={() => setRole('admin')}>
            <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', margin: 15, padding: 20, borderRadius: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  sub: { fontSize: 14, color: '#7f8c8d', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  roleContainer: { flexDirection: 'row', marginBottom: 10 },
  roleBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8, marginHorizontal: 4, backgroundColor: '#ecf0f1' },
  roleActive: { backgroundColor: '#3498db' },
  roleText: { fontWeight: '600', color: '#7f8c8d' },
  roleTextActive: { color: 'white' },
  button: { backgroundColor: '#3498db', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
