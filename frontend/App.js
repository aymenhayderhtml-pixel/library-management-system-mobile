import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import UserDashboardScreen from './src/screens/UserDashboardScreen';
import UserListScreen from './src/screens/UserListScreen';
import AddUserScreen from './src/screens/AddUserScreen';
import EditUserScreen from './src/screens/EditUserScreen';
import BookListScreen from './src/screens/BookListScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import EditBookScreen from './src/screens/EditBookScreen';
import BorrowListScreen from './src/screens/BorrowListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        
        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
        <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'User Control' }} />
        <Stack.Screen name="AddUser" component={AddUserScreen} options={{ title: 'Add User' }} />
        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Edit User' }} />
        
        {/* Shared Screens (render differently based on role) */}
        <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Books' }} />
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Add Book' }} />
        <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Edit Book' }} />
        <Stack.Screen name="BorrowList" component={BorrowListScreen} options={{ title: 'Borrowed Books' }} />
        
        {/* User Screens */}
        <Stack.Screen name="UserDashboard" component={UserDashboardScreen} options={{ title: 'My Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
