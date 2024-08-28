import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import auth from "@react-native-firebase/auth";
import { router } from 'expo-router';

export default function SettingsScreen() {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      router.replace("/login");
      console.log('User signed out successfully');
  } catch (error) {
      console.error('Error signing out:', error);
  }
    Alert.alert("Logged Out", "You have been logged out successfully.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
