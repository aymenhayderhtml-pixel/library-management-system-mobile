import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { booksAPI } from '../../services/api';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [copies, setCopies] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!author.trim()) e.author = 'Author is required';
    if (!category.trim()) e.category = 'Category is required';
    if (!copies || isNaN(copies) || parseInt(copies) < 1) e.copies = 'Must be at least 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await booksAPI.add({
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isbn: isbn.trim(),
        description: description.trim(),
        image: image.trim(),
        totalCopies: parseInt(copies),
      });
      Alert.alert('✅ Success', 'Book added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Required</Text>
          <InputField label="Title *" value={title} onChangeText={setTitle} placeholder="Book title" error={errors.title} />
          <InputField label="Author *" value={author} onChangeText={setAuthor} placeholder="Author name" error={errors.author} />
          <InputField label="Category *" value={category} onChangeText={setCategory} placeholder="e.g. Science, Fiction" error={errors.category} />
          <InputField
            label="Number of Copies *"
            value={copies}
            onChangeText={setCopies}
            placeholder="1"
            keyboardType="numeric"
            error={errors.copies}
          />

          <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>Optional</Text>
          <InputField label="ISBN" value={isbn} onChangeText={setIsbn} placeholder="ISBN number" />
          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Book description..."
            multiline
            numberOfLines={4}
          />
          <InputField label="Cover Image URL" value={image} onChangeText={setImage} placeholder="https://..." autoCapitalize="none" />

          <CustomButton title="Add Book" onPress={handleAdd} loading={loading} style={{ marginTop: spacing.md }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
});
