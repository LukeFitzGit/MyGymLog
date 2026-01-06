import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Importing our refactored components
import { Category, EXERCISE_LIST } from '@/components/ExerciseData';
import { WorkoutRow } from '@/components/workoutRow';

// Storage Keys
const STORAGE_KEYS = {
  CURRENT_WORKOUT: '@current_workout',
  HISTORY: '@workout_history',
  LAST_DATE: '@last_date',
};

export default function LogScreen() {
  const router = useRouter();
  const [sets, setSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Load Data on Startup (Page_Load) ---
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const today = new Date().toLocaleDateString();
        const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE);
        const savedSets = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
        
        // Check for Daily Reset
        if (lastDate !== today && lastDate !== null) {
          // Archive yesterday's work
          if (savedSets) {
            const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
            const history = historyJson ? JSON.parse(historyJson) : [];
            const archivedWorkout = { date: lastDate, data: JSON.parse(savedSets) };
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([...history, archivedWorkout]));
          }
          // Start fresh for new day
          setSets([{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }]);
        } else {
          // Resume today's session
          setSets(savedSets ? JSON.parse(savedSets) : [{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }]);
        }
        
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
      } catch (e) {
        console.error("Load Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // --- 2. Auto-Save Logic ---
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(sets));
    }
  }, [sets, isLoading]);

  // --- 3. Interaction Handlers ---
  const handleUpdate = (id: string, updates: any) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRowSubmit = (id: string) => {
    const currentRow = sets.find(s => s.id === id);
    if (!currentRow) return;

    const isComplete = currentRow.exercise && currentRow.reps && currentRow.weight;
    const isLastRow = sets[sets.length - 1].id === id;

    if (isComplete && isLastRow) {
      setSets([...sets, { id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }]);
    }
  };

  // NEW: Delete Handler
  const handleDelete = (id: string) => {
    const newSets = sets.filter(s => s.id !== id);
    
    // If we just deleted the last row, add a fresh one back in
    if (newSets.length === 0) {
      setSets([{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }]);
    } else {
      setSets(newSets);
    }
  };

  const getPrevCategory = (index: number): Category | undefined => {
    if (index === 0) return undefined;
    const prevName = sets[index - 1].exercise;
    return EXERCISE_LIST.find(e => e.name === prevName)?.category;
  };

  // Loading State UI
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1971c2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
      >
        <View style={styles.container}>
          <View style={styles.labelRow}>
            <Text style={[styles.labelText, { flex: 5 }]}>Exercise</Text>
            <Text style={[styles.labelText, { flex: 1.8 }]}>Reps</Text>
            <Text style={[styles.labelText, { flex: 2.2 }]}>Kg</Text>
            <View style={{ flex: 1 }} /> 
          </View>

          <ScrollView 
            keyboardShouldPersistTaps="handled" 
            style={{ flex: 1 }}
            // FIX: Added padding at the bottom of the scroll content
            contentContainerStyle={styles.scrollContent}
          >
            {sets.map((item, index) => {
              const isLastRow = index === sets.length - 1;
              const hasData = item.exercise || item.reps || item.weight;
              const showDelete = !isLastRow || hasData;

              return (
                <WorkoutRow 
                  key={item.id} 
                  data={item} 
                  onUpdate={handleUpdate} 
                  onRowSubmit={handleRowSubmit}
                  onDelete={showDelete ? handleDelete : undefined} 
                  prevCategory={getPrevCategory(index)}
                />
              );
            })}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: '#fff' },
  // FIX: Style to ensure the last row isn't hidden by the bottom tabs
  scrollContent: { 
    paddingBottom: 100 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  labelRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4, gap: 6, marginTop: 10 },
  labelText: { fontSize: 12, fontWeight: 'bold', color: '#999', textTransform: 'uppercase' },
});