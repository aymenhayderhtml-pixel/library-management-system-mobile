import React, { useState, useEffect } from 'react';
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

export default function EditBookScreen({ route, navigation }) {
  // Get book ID from navigation params
  const { id } = route.params;
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);

  // Load book data when screen opens
  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      const data = await response.json();
      setTitle(data.title);
      setAuthor(data.author);
      setCategory(data.category);
      setQuantity(String(data.quantity));
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load book');
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          category,
          quantity: Number(quantity)
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Book updated!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Edit Book</Text>
        
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
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput 
          style={styles.input} 
          value={quantity} 
          onChangeText={setQuantity} 
          keyboardType="numeric" 
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Book</Text>
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
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
    backgroundColor: '#3498db', 
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
