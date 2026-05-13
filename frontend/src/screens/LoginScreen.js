import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'user'
  const [error, setError] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const savedRole = await AsyncStorage.getItem('userRole');
    if (savedRole === 'admin') navigation.replace('AdminDashboard');
    if (savedRole === 'user') navigation.replace('UserDashboard');
  };

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (data.success) {
        // Save user data
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('userRole', data.role);
        await AsyncStorage.setItem('username', data.username);
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('fullName', data.fullName || data.username);

        // Navigate based on role
        if (data.role === 'admin') {
          navigation.replace('AdminDashboard');
        } else {
          navigation.replace('UserDashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>📚 Library System</Text>
        <Text style={styles.subtitle}>University Project</Text>

        {/* Role Selection Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, role === 'admin' && styles.toggleActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.toggleText, role === 'admin' && styles.toggleTextActive]}>👤 Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, role === 'user' && styles.toggleActive]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.toggleText, role === 'user' && styles.toggleTextActive]}>🎓 User</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login as {role === 'admin' ? 'Admin' : 'User'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Default Admin: admin / admin123{'\n'}
          Create users from Admin Dashboard
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#7f8c8d', marginBottom: 25 },
  toggleContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#ecf0f1', borderRadius: 10, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#3498db' },
  toggleText: { fontWeight: '600', color: '#7f8c8d' },
  toggleTextActive: { color: 'white' },
  error: { color: '#e74c3c', textAlign: 'center', marginBottom: 15, fontWeight: '500' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#2c3e50', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  hint: { textAlign: 'center', marginTop: 20, color: '#95a5a6', fontSize: 13, lineHeight: 20 },
});
