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
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isDueToday: boolean;
  isFirst: boolean;
  isLast: boolean;
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
  onEdit,
  onMoveUp,
  onMoveDown,
  isDueToday,
  isFirst,
  isLast,
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
      {/* Reorder buttons */}
      <View style={styles.reorderButtons}>
        <TouchableOpacity 
          style={[styles.reorderBtn, { opacity: isFirst ? 0.3 : 1 }]}
          onPress={onMoveUp}
          disabled={isFirst}
        >
          <Ionicons name="chevron-up" size={16} color={theme.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.reorderBtn, { opacity: isLast ? 0.3 : 1 }]}
          onPress={onMoveDown}
          disabled={isLast}
        >
          <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Checkbox */}
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
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        )}
      </Pressable>
      
      {/* Content - tap to edit */}
      <TouchableOpacity style={styles.content} onPress={onEdit} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
            <Ionicons name={habit.icon as any} size={16} color={habit.color} />
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
            <Ionicons name="flame" size={12} color={theme.warning} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              {habit.currentStreak}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={12} color={theme.primary} />
            <Text style={[styles.statText, { color: theme.textSecondary }]}>
              {habit.longestStreak}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Edit button */}
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="pencil" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  reorderButtons: {
    flexDirection: 'column',
    marginRight: 6,
  },
  reorderBtn: {
    padding: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyBadge: {
    fontSize: 10,
    marginTop: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 11,
  },
  editButton: {
    padding: 8,
  },
});
