import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { colors, spacing } from '../../styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const { data } = await authAPI.login({ email: email.trim(), password });
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data));
      // Navigate to correct dashboard
      navigation.replace(data.role === 'admin' ? 'AdminTabs' : 'StudentTabs');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your connection.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo / Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.appName}>LibraryMS</Text>
          <Text style={styles.tagline}>University Library Management System</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <CustomButton title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
              Register
            </Text>
          </View>

          {/* Default credentials hint */}
          <View style={styles.hint}>
            <Text style={styles.hintText}>Default Admin: admin@library.com / admin123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 56 },
  appName: { fontSize: 28, fontWeight: '800', color: colors.white, marginTop: 8 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textLight, marginBottom: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  footerText: { color: colors.textLight, fontSize: 14 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  hint: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 10,
  },
  hintText: { color: colors.primary, fontSize: 12, textAlign: 'center' },
});
