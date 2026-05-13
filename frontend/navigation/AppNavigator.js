import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

// Student Screens
import HomeScreen from '../screens/student/HomeScreen';
import BorrowedBooksScreen from '../screens/student/BorrowedBooksScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import BookDetailScreen from '../screens/student/BookDetailScreen';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import AddBookScreen from '../screens/admin/AddBookScreen';
import ManageBooksScreen from '../screens/admin/ManageBooksScreen';
import EditBookScreen from '../screens/admin/EditBookScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import BorrowRecordsScreen from '../screens/admin/BorrowRecordsScreen';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Auth Stack ───────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Student Home Stack (Home + BookDetail) ───────────
function StudentHomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="HomeList" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
    </Stack.Navigator>
  );
}

// ─── Student Tabs ─────────────────────────────────────
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingBottom: 6, paddingTop: 4, height: 60 },
        tabBarLabel: ({ color, focused }) => {
          const labels = { Home: '📚 Library', Borrowed: '📋 Borrowed', Profile: '👤 Profile' };
          return <Text style={{ color, fontSize: 11, fontWeight: focused ? '700' : '400' }}>{labels[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={StudentHomeStack} />
      <Tab.Screen name="Borrowed" component={BorrowedBooksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Admin Manage Books Stack ─────────────────────────
function AdminBooksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ManageBooksList" component={ManageBooksScreen} options={{ title: 'Manage Books' }} />
      <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Edit Book' }} />
    </Stack.Navigator>
  );
}

// ─── Admin Tabs ───────────────────────────────────────
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingBottom: 6, paddingTop: 4, height: 60 },
        tabBarLabel: ({ color, focused }) => {
          const labels = {
            Dashboard: '📊 Dashboard',
            AddBook: '➕ Add Book',
            ManageBooks: '📚 Books',
            Users: '👥 Users',
            BorrowRecords: '📋 Borrows',
          };
          return <Text style={{ color, fontSize: 10, fontWeight: focused ? '700' : '400' }}>{labels[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Add Book' }} />
      <Tab.Screen name="ManageBooks" component={AdminBooksStack} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="BorrowRecords" component={BorrowRecordsScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
    </Stack.Navigator>
  );
}
