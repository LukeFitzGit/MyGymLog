import { Ionicons } from '@expo/vector-icons'; // Import for the bin icon
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Category, EXERCISE_LIST, getMatches } from './ExerciseData';

interface WorkoutRowProps {
  data: {
    id: string;
    exercise: string;
    reps: string;
    weight: string;
    isEditing: boolean;
  };
  onUpdate: (id: string, updates: any) => void;
  onRowSubmit: (id: string) => void;
  onDelete?: (id: string) => void; // Made optional with '?'
  prevCategory?: Category;
}

export const WorkoutRow = ({ data, onUpdate, onRowSubmit, onDelete, prevCategory }: WorkoutRowProps) => {
  
  const handleFinishTyping = () => {
    if (!data.exercise.trim()) return;
    const matches = getMatches(data.exercise, prevCategory);
    onUpdate(data.id, { exercise: matches[0], isEditing: false });
  };

  const handleCycle = () => {
    const currentDef = EXERCISE_LIST.find(e => e.name === data.exercise);
    const searchInitials = currentDef ? currentDef.initials : data.exercise;
    const matches = getMatches(searchInitials, prevCategory);
    const currentIndex = matches.indexOf(data.exercise);
    const nextIndex = (currentIndex + 1) % matches.length;
    onUpdate(data.id, { exercise: matches[nextIndex] });
  };

  return (
    <View style={styles.row}>
      {/* Exercise Field */}
      <View style={{ flex: 5 }}>
        {data.isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Initials"
            autoFocus
            value={data.exercise}
            autoCapitalize="characters"
            onChangeText={(val) => onUpdate(data.id, { exercise: val })}
            onBlur={handleFinishTyping}
            onSubmitEditing={handleFinishTyping}
          />
        ) : (
          <Pressable 
            style={[styles.input, styles.cycleButton]}
            onPress={handleCycle}
            onLongPress={() => onUpdate(data.id, { isEditing: true })}
          >
            <Text numberOfLines={1} style={styles.exerciseText}>
              {data.exercise || '---'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1.8 }}>
        <TextInput
          style={styles.input}
          placeholder="Reps"
          keyboardType="numeric"
          value={data.reps}
          onChangeText={(val) => onUpdate(data.id, { reps: val })}
        />
      </View>

      <View style={{ flex: 2.2 }}>
        <TextInput
          style={styles.input}
          placeholder="Kg"
          keyboardType="numeric"
          value={data.weight}
          onChangeText={(val) => onUpdate(data.id, { weight: val })}
          onSubmitEditing={() => onRowSubmit(data.id)}
          returnKeyType="done"
        />
      </View>

      {/* Conditional Delete Button - Keeps layout consistent */}
      {onDelete ? (
        <Pressable 
          style={styles.deleteButton} 
          onPress={() => onDelete(data.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </Pressable>
      ) : (
        <View style={styles.deleteButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 8, 
    gap: 6 
  },
  input: { 
    backgroundColor: '#f8f9fa', 
    borderWidth: 1, 
    borderColor: '#dee2e6', 
    borderRadius: 8, 
    paddingVertical: 10, 
    paddingHorizontal: 8, 
    fontSize: 14, 
    minHeight: 44, 
    width: '100%', 
    justifyContent: 'center' 
  },
  cycleButton: { 
    backgroundColor: '#e7f5ff', 
    borderColor: '#a5d8ff' 
  },
  exerciseText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#1971c2' 
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  }
});