import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { API_URL } from '../config';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          category,
          quantity: Number(quantity)
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Book added successfully!');
        navigation.goBack(); // Go back to book list
      } else {
        Alert.alert('Error', 'Failed to add book');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Add New Book</Text>
        
        <Text style={styles.label}>Title</Text>
        <TextInput 
          style={styles.input} 
          value={title} 
          onChangeText={setTitle} 
        />

        <Text style={styles.label}>Author</Text>
        <TextInput 
          style={styles.input} 
          value={author} 
          onChangeText={setAuthor} 
        />

        <Text style={styles.label}>Category</Text>
        <TextInput 
          style={styles.input} 
          value={category} 
          onChangeText={setCategory} 
          placeholder="e.g. Computer Science" 
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput 
          style={styles.input} 
          value={quantity} 
          onChangeText={setQuantity} 
          keyboardType="numeric" 
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  card: { 
    backgroundColor: 'white', 
    margin: 15, 
    padding: 20, 
    borderRadius: 10 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#2c3e50' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#555' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#27ae60', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
