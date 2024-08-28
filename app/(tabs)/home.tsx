import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import database from "@react-native-firebase/database";

interface Announcement {
  text: string;
}

export default function HomeScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcementsRef = database().ref('announcements');
      announcementsRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const announcementsList: Announcement[] = Object.values(data);
          setAnnouncements(announcementsList);
        } else {
          setAnnouncements([]);
        }
      });

      return () => announcementsRef.off();
    };

    fetchAnnouncements();
  }, []);

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
        <ThemedText type="title">Announcement</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {announcements.map((announcement, index) => (
          <View key={index} style={styles.announcementContainer}>
            <ThemedText>{announcement.text}</ThemedText>
          </View>
        ))}
      </ThemedView>
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
  announcementContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
