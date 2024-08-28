import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

const UserProfileScreen = () => {
  const [user, setUser] = useState<{ uid: string, name: string, email: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userSnapshot = await database().ref(`users/${currentUser.uid}`).once('value');
        setUser({ uid: currentUser.uid, ...userSnapshot.val() });
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.info}>Name: {user.name}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <QRCode value={user.uid} size={200} />
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
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default UserProfileScreen;
