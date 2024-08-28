import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import "@/components/firebaseConfig";

export default function HomeScreen() {
  const handlePress = () => {
    router.push("/login")
  }
  return (
      <SafeAreaView>
          <Text>Hello</Text>
          <TouchableOpacity onPress={handlePress} style={{ marginTop: 50}}>
            <Text>Click me</Text>
          </TouchableOpacity>
    </SafeAreaView>
  );
}

