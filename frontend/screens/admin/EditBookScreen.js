import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { booksAPI } from '../../services/api';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function EditBookScreen({ route, navigation }) {
  const { book } = route.params;

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [isbn, setIsbn] = useState(book.isbn || '');
  const [description, setDescription] = useState(book.description || '');
  const [image, setImage] = useState(book.image || '');
  const [copies, setCopies] = useState(String(book.totalCopies));
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

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await booksAPI.update(book._id, {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isbn: isbn.trim(),
        description: description.trim(),
        image: image.trim(),
        totalCopies: parseInt(copies),
      });
      Alert.alert('✅ Updated', 'Book updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <InputField label="Title *" value={title} onChangeText={setTitle} error={errors.title} />
          <InputField label="Author *" value={author} onChangeText={setAuthor} error={errors.author} />
          <InputField label="Category *" value={category} onChangeText={setCategory} error={errors.category} />
          <InputField label="Total Copies *" value={copies} onChangeText={setCopies} keyboardType="numeric" error={errors.copies} />
          <InputField label="ISBN" value={isbn} onChangeText={setIsbn} />
          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <InputField label="Cover Image URL" value={image} onChangeText={setImage} autoCapitalize="none" />
          <CustomButton title="Save Changes" onPress={handleUpdate} loading={loading} style={{ marginTop: spacing.md }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.white, margin: spacing.md,
    borderRadius: radius.lg, padding: spacing.md, ...shadow.sm,
  },
});
