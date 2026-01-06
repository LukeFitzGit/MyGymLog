import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await AsyncStorage.getItem('@workout_history');
      if (data) setHistory(JSON.parse(data).reverse());
    };
    loadHistory();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {history.map((item: any, index: number) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>{item.date}</Text>
          {item.data.map((set: any, i: number) => (
            <Text key={i} style={styles.detail}>{set.exercise}: {set.reps} x {set.weight}Kg</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  date: { fontWeight: 'bold', color: '#1971c2', marginBottom: 5 },
  detail: { color: '#666', fontSize: 14 }
});