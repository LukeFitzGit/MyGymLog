import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data & Insights</Text>
      
      <View style={styles.menuList}>
        <Pressable style={styles.menuButton} onPress={() => router.push('/WorkoutHistory')}>
          <Text style={styles.menuButtonText}>Workout History</Text>
        </Pressable>

        <Pressable style={[styles.menuButton, styles.disabled]}>
          <Text style={styles.menuButtonText}>Strength Trends (Coming Soon)</Text>
        </Pressable>

        <Pressable style={[styles.menuButton, styles.disabled]}>
          <Text style={styles.menuButtonText}>Volume Analytics (Coming Soon)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  menuList: { gap: 15 },
  menuButton: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#dee2e6' },
  menuButtonText: { fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 }
});