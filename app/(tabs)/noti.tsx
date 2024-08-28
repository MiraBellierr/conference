import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

interface Announcement {
  text: string;
  timestamp: number;
}

const NotificationScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUserCheckedIn, setCurrentUserCheckedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcementsRef = database().ref('announcements');
      announcementsRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const announcementsList: Announcement[] = Object.values(data);
          announcementsList.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending
          setAnnouncements(announcementsList);
        } else {
          setAnnouncements([]);
        }
      });

      return () => announcementsRef.off();
    };

    fetchAnnouncements();

    const checkCurrentUserCheckIn = async () => {
      const user = auth().currentUser;
      if (user) {
        const userRef = database().ref(`users/${user.uid}`);
        userRef.on('value', snapshot => {
          const userData = snapshot.val();
          if (userData && userData.firstDayCheckIn) {
            setCurrentUserCheckedIn(true);
          } else {
            setCurrentUserCheckedIn(false);
          }
        });
      }
    };

    checkCurrentUserCheckIn();

    return () => {
      const user = auth().currentUser;
      if (user) {
        const userRef = database().ref(`users/${user.uid}`);
        userRef.off();
      }
    };
  }, []);

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={styles.announcementContainer}>
      <ThemedText>{item.text}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      {currentUserCheckedIn && (
        <ThemedText style={styles.checkInText}>You have checked in!</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  announcementContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  checkInText: {
    color: 'green',
  },
});

export default NotificationScreen;
