import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";
import { PERMISSIONS, request, RESULTS, PermissionStatus } from 'react-native-permissions';
import database from '@react-native-firebase/database';
import { useRouter } from 'expo-router';

const QRCodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<PermissionStatus | null>(null);
  const [scanned, setScanned] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null); // State to hold user information
  const router = useRouter();

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted' ? RESULTS.GRANTED : RESULTS.DENIED);
      } catch (error) {
        console.error('Failed to request camera permission:', error);
        setHasPermission(RESULTS.DENIED);
      }
    };

    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    try {
      const userRef = database().ref(`users/${data}`);
      const snapshot = await userRef.once('value');
      const userData = snapshot.val();

      if (userData) {
        // Update user's firstDayCheckIn status
        await userRef.update({ firstDayCheckIn: true });

        // Show success alert with user's name
        Alert.alert('Check-In Success', `User ${userData.name} has been checked in for the first day.`);
        router.back();
      } else {
        Alert.alert('User Not Found', 'No user found with this UID.');
      }
    } catch (error) {
      console.error('Error updating check-in status:', error);
      Alert.alert('Error', 'Failed to update check-in status.');
    }
  };

  if (hasPermission !== RESULTS.GRANTED) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission Required</Text>
        <Text style={styles.instruction}>We need access to your camera to scan QR codes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Text style={styles.button} onPress={() => setScanned(false)}>
          Tap to Scan Again
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    fontSize: 18,
    color: 'blue',
    marginTop: 16,
  },
});

export default QRCodeScannerScreen;
