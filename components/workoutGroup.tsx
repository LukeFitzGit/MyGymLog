import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const WorkoutGroup = ({ title, children, totalSets }: { title: string, children: React.ReactNode, totalSets: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.groupContainer}>
      <Pressable style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.headerLeft}>
          <Ionicons name={isOpen ? "chevron-down" : "chevron-forward"} size={20} color="#1971c2" />
          <Text style={styles.headerText}>{title || "New Exercise"}</Text>
        </View>
        <Text style={styles.badge}>{totalSets} Sets</Text>
      </Pressable>
      
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: { marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e9ecef' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f1f3f5' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerText: { fontWeight: '700', color: '#495057', fontSize: 15 },
  badge: { backgroundColor: '#e7f5ff', color: '#1971c2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, fontSize: 12, fontWeight: 'bold' },
  content: { padding: 8 }
});