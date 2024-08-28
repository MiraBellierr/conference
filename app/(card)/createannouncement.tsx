import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import database from '@react-native-firebase/database';

export default function CreateAnnouncementScreen() {
  const [announcement, setAnnouncement] = useState('');

  const handleSubmit = async () => {
    if (announcement.trim() === '') {
      Alert.alert('Error', 'Announcement cannot be empty.');
      return;
    }

    try {
      const announcementsRef = database().ref('announcements');
      announcementsRef.push({ text: announcement });
      Alert.alert('Success', 'Announcement created successfully.');
      setAnnouncement('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create announcement.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Notification</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter announcement"
        value={announcement}
        onChangeText={setAnnouncement}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});
