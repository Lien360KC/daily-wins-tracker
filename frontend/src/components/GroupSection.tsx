import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitGroup, Habit } from '../store/habitStore';
import { Theme } from '../theme/colors';
import { HabitCard } from './HabitCard';
import { format } from 'date-fns';

interface GroupSectionProps {
  group: HabitGroup;
  habits: Habit[];
  theme: Theme;
  progress: { completed: number; total: number; percentage: number };
  onToggleHabit: (habitId: string) => void;
  onDeleteHabit: (habitId: string, habitName: string) => void;
  onViewStats: () => void;
  isHabitDueToday: (habit: Habit) => boolean;
}

export const GroupSection: React.FC<GroupSectionProps> = ({
  group,
  habits,
  theme,
  progress,
  onToggleHabit,
  onDeleteHabit,
  onViewStats,
  isHabitDueToday,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Group Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: group.color + '20' }]}>
            <Ionicons name={group.icon as any} size={20} color={group.color} />
          </View>
          <View>
            <Text style={[styles.groupName, { color: theme.text }]}>{group.name}</Text>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {progress.completed}/{progress.total} complete
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {/* Progress indicator */}
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress.percentage}%`, 
                  backgroundColor: group.color 
                }
              ]} 
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.statsButton, { backgroundColor: theme.surfaceHover }]}
            onPress={onViewStats}
          >
            <Ionicons name="stats-chart" size={16} color={theme.primary} />
          </TouchableOpacity>
          
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.textMuted} 
          />
        </View>
      </TouchableOpacity>
      
      {/* Habits List */}
      {isExpanded && (
        <View style={styles.habitsContainer}>
          {habits.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No habits in this group yet
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                theme={theme}
                onToggle={() => onToggleHabit(habit.id)}
                onDelete={() => onDeleteHabit(habit.id, habit.name)}
                isDueToday={isHabitDueToday(habit)}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    width: 50,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
