import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../store/habitStore';
import { Theme } from '../theme/colors';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  theme: Theme;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  theme,
  onToggle,
  onDelete,
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = habit.completedDates.includes(today);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        style={[styles.checkbox, { borderColor: isCompleted ? habit.color : theme.border, backgroundColor: isCompleted ? habit.color : 'transparent' }]}
        onPress={onToggle}
      >
        {isCompleted && (
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        )}
      </Pressable>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
            <Ionicons name={habit.icon as any} size={18} color={habit.color} />
          </View>
          <Text style={[styles.habitName, { color: theme.text }, isCompleted && styles.completedText]}>
            {habit.name}
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={14} color={theme.warning} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              {habit.currentStreak} day streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={14} color={theme.primary} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              Best: {habit.longestStreak}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
});
