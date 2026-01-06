import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

// Helper for 1RM Calculation (Brzycki Formula)
const calculate1RM = (weight: number, reps: number) => {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; 
  return weight * (36 / (37 - reps));
};

// --- Reusable Chart Card Component ---
const StrengthCard = ({ title, data }: { title: string, data: any[] }) => {
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title} (Est. 1RM)</Text>
      {data.length > 1 ? (
        <LineChart
          data={data}
          height={150} // Slightly shorter to fit multiple on screen
          width={Dimensions.get('window').width - 80}
          color="#1971c2"
          thickness={3}
          startFillColor="rgba(25, 113, 194, 0.2)"
          endFillColor="rgba(25, 113, 194, 0.01)"
          areaChart
          curved
          noOfSections={3}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          dataPointsColor="#1971c2"
          hideRules
          yAxisThickness={0}
          xAxisThickness={1}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Need more {title} data to show trend.</Text>
        </View>
      )}
    </View>
  );
};

export default function StrengthTrends() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Define the lifts you want to display
  const mainLifts = ['Bench Press', 'Squat', 'Deadlift'];

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AsyncStorage.getItem('@workout_history');
        if (data) setHistory(JSON.parse(data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Helper to get data for a specific exercise
  const getChartDataFor = (exerciseName: string) => {
    return history
      .map(session => {
        const exerciseSets = session.data.filter((s: any) => s.exercise === exerciseName);
        if (exerciseSets.length === 0) return null;

        const best1RM = exerciseSets.reduce((max: number, set: any) => {
          const weight = parseFloat(set.weight) || 0;
          const reps = parseInt(set.reps) || 0;
          const oneRM = calculate1RM(weight, reps);
          return oneRM > max ? oneRM : max;
        }, 0);

        if (best1RM === 0) return null;

        return {
          value: Math.round(best1RM),
          label: session.date.split('/')[0] + '/' + session.date.split('/')[1],
        };
      })
      .filter(item => item !== null);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: 'Strength Trends' }} />
      
      <Text style={styles.headerTitle}>Progressive Overload</Text>
      <Text style={styles.subTitle}>Tracking your estimated 1-rep max across the "Big Three".</Text>

      {mainLifts.map(lift => (
        <StrengthCard 
          key={lift} 
          title={lift} 
          data={getChartDataFor(lift)} 
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subTitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  chartCard: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 20,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#495057', marginBottom: 15 },
  axisText: { color: '#adb5bd', fontSize: 10 },
  emptyState: { height: 100, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#adb5bd', fontSize: 13 }
});