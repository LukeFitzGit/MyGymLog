import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Importing our refactored components
import { Category, EXERCISE_LIST } from '@/components/ExerciseData';
import { WorkoutRow } from '@/components/workoutRow';

// --- 1. TypeScript Interfaces ---
interface WorkoutSet {
  id: string;
  exercise: string;
  reps: string;
  weight: string;
  isEditing: boolean;
}

interface WorkoutGroupData {
  exercise: string;
  items: WorkoutSet[];
}

// --- 2. Sub-Component: WorkoutGroup (Accordion) ---
const WorkoutGroup = ({ title, children, totalSets }: { title: string, children: React.ReactNode, totalSets: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.groupContainer}>
      <Pressable style={styles.groupHeader} onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.headerLeft}>
          <Ionicons name={isOpen ? "chevron-down" : "chevron-forward"} size={18} color="#1971c2" />
          <Text style={styles.headerText}>{title || "New Exercise"}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalSets} Sets</Text>
        </View>
      </Pressable>
      {isOpen && <View style={styles.groupContent}>{children}</View>}
    </View>
  );
};

// Storage Keys
const STORAGE_KEYS = {
  CURRENT_WORKOUT: '@current_workout',
  HISTORY: '@workout_history',
  LAST_DATE: '@last_date',
};

export default function LogScreen() {
  const router = useRouter();
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 3. Initialization Logic ---
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const today = new Date().toLocaleDateString();
        const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE);
        const savedSets = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
        
        let initialSets: WorkoutSet[] = [];
        
        if (lastDate !== today && lastDate !== null) {
          if (savedSets) {
            const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
            const history = historyJson ? JSON.parse(historyJson) : [];
            const archivedWorkout = { date: lastDate, data: JSON.parse(savedSets) };
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([...history, archivedWorkout]));
          }
          initialSets = [{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }];
        } else {
          initialSets = savedSets ? JSON.parse(savedSets) : [{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }];
        }

        if (initialSets.length === 0) {
          initialSets = [{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }];
        }

        setSets(initialSets);
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
      } catch (e) {
        console.error("Load Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // --- 4. Auto-Save Logic ---
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(sets));
    }
  }, [sets, isLoading]);

  // --- 5. Interaction Handlers ---
  const handleUpdate = (id: string, updates: Partial<WorkoutSet>) => {
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

  const handleDelete = (id: string) => {
    setSets(prev => {
      const newSets = prev.filter(s => s.id !== id);
      return newSets.length === 0 
        ? [{ id: Date.now().toString(), exercise: '', reps: '', weight: '', isEditing: true }]
        : newSets;
    });
  };

  const getPrevCategory = (index: number): Category | undefined => {
    if (index === 0) return undefined;
    const prevName = sets[index - 1].exercise;
    return EXERCISE_LIST.find(e => e.name === prevName)?.category;
  };

  // --- 6. Grouping Logic ---
  const groupedSets = sets.reduce((groups: WorkoutGroupData[], set: WorkoutSet) => {
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.exercise !== set.exercise) {
      groups.push({ exercise: set.exercise, items: [set] });
    } else {
      lastGroup.items.push(set);
    }
    return groups;
  }, []);

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
            contentContainerStyle={styles.scrollContent}
          >
            {groupedSets.map((group: WorkoutGroupData, groupIndex: number) => {
              const isLatestGroup = groupIndex === groupedSets.length - 1;

              const rows = group.items.map((item: WorkoutSet) => {
                const globalIndex = sets.findIndex(s => s.id === item.id);
                const isLastRow = globalIndex === sets.length - 1;
                return (
                  <WorkoutRow 
                    key={item.id} 
                    data={item} 
                    onUpdate={handleUpdate} 
                    onRowSubmit={handleRowSubmit}
                    onDelete={!isLastRow ? handleDelete : undefined} 
                    prevCategory={getPrevCategory(globalIndex)}
                  />
                );
              });

              if (isLatestGroup) {
                return (
                  <View key={`group-${groupIndex}`} style={{ marginBottom: 10 }}>
                    {rows}
                  </View>
                );
              }

              return (
                <WorkoutGroup 
                  key={`group-${groupIndex}`} 
                  title={group.exercise} 
                  totalSets={group.items.length}
                >
                  {rows}
                </WorkoutGroup>
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
  scrollContent: { paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  labelRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4, gap: 6, marginTop: 10 },
  labelText: { fontSize: 12, fontWeight: 'bold', color: '#999', textTransform: 'uppercase' },
  groupContainer: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e9ecef' },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f8f9fa' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerText: { fontWeight: '700', color: '#343a40', fontSize: 14 },
  badge: { backgroundColor: '#e7f5ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#1971c2', fontSize: 11, fontWeight: 'bold' },
  groupContent: { padding: 8, backgroundColor: '#fff' }
});