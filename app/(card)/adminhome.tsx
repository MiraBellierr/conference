import React, { useState } from 'react';
import { Image, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import Card from '@/components/card';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { router } from 'expo-router';

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    try {
      await auth().signOut();
      router.replace("/login");
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleImportAttendees = async () => {
    setIsLoading(true); // Set loading state when import starts

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      const fileUri = result[0].uri;

      // Read file using react-native-fs
      const fileContents = await RNFS.readFile(fileUri, 'base64');
      const binaryData = atob(fileContents);
      const data = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        data[i] = binaryData.charCodeAt(i);
      }

      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const attendees = jsonData.map((row: any) => ({
        name: row['Name'],
        email: row['Email'],
        paid: row['Paid'] === 'yes', // Adjust accordingly based on your Excel data
      }));

      console.log(attendees)

      // Process attendees
      for (const attendee of attendees) {
        if (attendee.paid) {
          const password = generatePassword();
          try {
            const userCredential = await auth().createUserWithEmailAndPassword(attendee.email, password);
            const uid = userCredential.user.uid;

            // Push user data to Firebase Realtime Database
            await database().ref(`users/${uid}`).set({
              name: attendee.name,
              email: attendee.email,
              firstDayCheckIn: false
            });

            // Send email
            const response = await fetch('https://chatty-shrimps-teach.loca.lt/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: attendee.email,
                subject: 'Welcome to Our Conference',
                text: `Hello ${attendee.name},\n\nYour account has been created successfully. Your password is: ${password}\n\nThank you!`,
              }),
            });

            const responseData = await response.text();
            console.log(`Email sent to ${attendee.email}: ${responseData}`);
            console.log(`Account created for ${attendee.name} with email ${attendee.email} and password ${password}`);
          } catch (error) {
            console.error(`Error creating account for ${attendee.name}:`, error);
          }
        }
      }

      Alert.alert('Import Complete', 'Attendees processed and accounts created.');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error('Error: ', err);
        Alert.alert('Error', 'Failed to pick the file.');
      }
    } finally {
      setIsLoading(false); // Clear loading state after import completes or fails
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerText='My Attendance Now'
      headerImage={
        <Image
          source={{ uri: "https://imgs.search.brave.com/HVZpe6t6RsA4NhaMzWLu8Kovs2iNWv1gXfLqlSf7CVI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtY3NlLmNhbnZh/LmNvbS9ibG9iLzU3/MTk1OC9QZXJmZWN0/V2ViQmFubmVyQWRm/ZWF0dXJlZGltYWdl/MS5qcGc"}}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Admin Actions</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='default'>Choose any of the below to start with</ThemedText>
        <Card title="Scan Attendance QR" description="Scan the QR code for attendance" image={require("../../assets/images/qr.png")} onPress={() => {router.navigate("/qrscan")}}/>
        <Card title="Import Attendees" description="Import the list of attendees from Excel file" image={require("../../assets/images/import.png")} onPress={handleImportAttendees}/>
        <Card title="Create Notification" description="Create a notification for attendees" image={require("../../assets/images/speaker-icon.png")} onPress={() => { router.navigate("createannouncement") }} />
        <Card title="Log Out" description="Log out from admin dashboard" image={require("../../assets/images/logout.png")} onPress={handleLogOut}/>
      </ThemedView>
      
      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 400,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
