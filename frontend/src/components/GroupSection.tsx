import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitGroup, Habit } from '../store/habitStore';
import { Theme } from '../theme/colors';
import { HabitCard } from './HabitCard';

interface GroupSectionProps {
  group: HabitGroup;
  habits: Habit[];
  theme: Theme;
  progress: { completed: number; total: number; percentage: number };
  onToggleHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  onMoveHabitUp: (habitId: string) => void;
  onMoveHabitDown: (habitId: string) => void;
  onViewStats: () => void;
  onEditGroup: () => void;
  isHabitDueToday: (habit: Habit) => boolean;
}

export const GroupSection: React.FC<GroupSectionProps> = ({
  group,
  habits,
  theme,
  progress,
  onToggleHabit,
  onEditHabit,
  onMoveHabitUp,
  onMoveHabitDown,
  onViewStats,
  onEditGroup,
  isHabitDueToday,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sort habits by order
  const sortedHabits = [...habits].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Group Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        onLongPress={onEditGroup}
        delayLongPress={400}
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
                  backgroundColor: progress.percentage === 100 ? theme.success : group.color 
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

          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.surfaceHover }]}
            onPress={onEditGroup}
          >
            <Ionicons name="pencil" size={16} color={theme.textSecondary} />
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
          {sortedHabits.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No habits in this group yet
              </Text>
            </View>
          ) : (
            sortedHabits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                theme={theme}
                onToggle={() => onToggleHabit(habit.id)}
                onEdit={() => onEditHabit(habit)}
                onMoveUp={() => onMoveHabitUp(habit.id)}
                onMoveDown={() => onMoveHabitDown(habit.id)}
                isDueToday={isHabitDueToday(habit)}
                isFirst={index === 0}
                isLast={index === sortedHabits.length - 1}
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
    gap: 8,
  },
  progressBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
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
