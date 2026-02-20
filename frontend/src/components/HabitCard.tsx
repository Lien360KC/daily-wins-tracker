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
  isDueToday: boolean;
}

const getFrequencyText = (habit: Habit): string => {
  switch (habit.frequency.type) {
    case 'daily':
      return 'Daily';
    case 'weekdays':
      return 'Weekdays';
    case 'weekends':
      return 'Weekends';
    case 'custom':
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      return habit.frequency.customDays?.map((d) => days[d]).join('') || '';
    default:
      return 'Daily';
  }
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  theme,
  onToggle,
  onDelete,
  isDueToday,
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = habit.completedDates.includes(today);

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.surface, 
        borderColor: theme.border,
        opacity: isDueToday ? 1 : 0.5,
      }
    ]}>
      <Pressable
        style={[
          styles.checkbox, 
          { 
            borderColor: isCompleted ? habit.color : theme.border, 
            backgroundColor: isCompleted ? habit.color : 'transparent' 
          }
        ]}
        onPress={isDueToday ? onToggle : undefined}
        disabled={!isDueToday}
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
          <View style={styles.titleContainer}>
            <Text style={[styles.habitName, { color: theme.text }, isCompleted && styles.completedText]}>
              {habit.name}
            </Text>
            <Text style={[styles.frequencyBadge, { color: theme.textMuted }]}>
              {getFrequencyText(habit)}
            </Text>
          </View>
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
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
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
  titleContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
  },
  frequencyBadge: {
    fontSize: 11,
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  stats: {
    flexDirection: 'row',
    gap: 14,
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
