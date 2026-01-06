import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStrengthDataForExercise } from '../utils/calculate1RM';

export default function StrengthTrends() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');

  useEffect(() => {
    const loadData = async () => {
      const savedHistory = await AsyncStorage.getItem('@workout_history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // In the future, this is where you'd call fetch('myserver.com/api/history')
        const data = getStrengthDataForExercise(history, selectedExercise);
        setChartData(data);
      }
    };
    loadData();
  }, [selectedExercise]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedExercise} 1RM Trend</Text>
      
      {chartData.length > 1 ? (
        <LineChart
          data={chartData}
          height={250}
          width={Dimensions.get('window').width - 80}
          initialSpacing={20}
          color="#1971c2"
          thickness={3}
          dataPointsColor="#1971c2"
          noOfSections={5}
          yAxisColor="#dee2e6"
          xAxisColor="#dee2e6"
          yAxisTextStyle={{color: '#999', fontSize: 10}}
          xAxisLabelTextStyle={{color: '#999', fontSize: 10}}
          curved
          isAnimated
        />
      ) : (
        <View style={styles.empty}>
          <Text>Not enough data to generate a trend yet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  empty: { height: 250, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12 }
});