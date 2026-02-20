import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useHabitStore, HabitGroup } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { ProgressRing } from '../../src/components/ProgressRing';
import { AddHabitModal } from '../../src/components/AddHabitModal';
import { AddGroupModal } from '../../src/components/AddGroupModal';
import { GroupSection } from '../../src/components/GroupSection';
import { GroupStatsModal } from '../../src/components/GroupStatsModal';

export default function TodayScreen() {
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<HabitGroup | null>(null);
  
  const {
    habits,
    groups,
    settings,
    addHabit,
    addGroup,
    removeHabit,
    toggleHabitCompletion,
    getTodayProgress,
    getGroupProgress,
    getGroupStats,
    isHabitDueOnDate,
  } = useHabitStore();

  const theme = settings.isDarkMode ? darkTheme : lightTheme;
  const today = format(new Date(), 'yyyy-MM-dd');
  const { completed, total } = getTodayProgress();
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const handleDeleteHabit = (id: string, name: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${name}"? This will remove all your progress.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeHabit(id),
        },
      ]
    );
  };

  const handleViewStats = (group: HabitGroup) => {
    setSelectedGroup(group);
    setStatsModalVisible(true);
  };

  const getMotivationalMessage = () => {
    if (total === 0) return "Add your first habit to get started!";
    if (completed === total) return "You crushed it today!";
    if (progress >= 75) return "Almost there, keep going!";
    if (progress >= 50) return "Great progress today!";
    if (progress >= 25) return "Keep the momentum going!";
    return "Let's build some momentum!";
  };

  const sortedGroups = [...groups].sort((a, b) => a.order - b.order);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>Daily Wins</Text>
          </View>
          <TouchableOpacity
            style={[styles.addGroupButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setGroupModalVisible(true)}
          >
            <Ionicons name="folder-open" size={18} color={theme.primary} />
            <Ionicons name="add" size={14} color={theme.primary} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.progressContent}>
            <ProgressRing
              progress={progress}
              size={90}
              strokeWidth={9}
              backgroundColor={theme.border}
              progressColor={theme.primary}
            >
              <Text style={[styles.progressPercent, { color: theme.text }]}>
                {Math.round(progress)}%
              </Text>
            </ProgressRing>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressTitle, { color: theme.text }]}>
                Today's Progress
              </Text>
              <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
                {completed} of {total} habits complete
              </Text>
              <Text style={[styles.motivational, { color: theme.primary }]}>
                {getMotivationalMessage()}
              </Text>
            </View>
          </View>
        </View>

        {/* Add Habit Button */}
        <TouchableOpacity
          style={[styles.addHabitButton, { backgroundColor: theme.primary }]}
          onPress={() => setHabitModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addHabitButtonText}>Add New Habit</Text>
        </TouchableOpacity>

        {/* Groups Sections */}
        <View style={styles.groupsContainer}>
          {sortedGroups.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="folder-open" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No groups yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Create a group to organize your habits
              </Text>
            </View>
          ) : (
            sortedGroups.map((group) => {
              const groupHabits = habits.filter((h) => h.groupId === group.id);
              const groupProgress = getGroupProgress(group.id);
              
              return (
                <GroupSection
                  key={group.id}
                  group={group}
                  habits={groupHabits}
                  theme={theme}
                  progress={groupProgress}
                  onToggleHabit={(habitId) => toggleHabitCompletion(habitId, today)}
                  onDeleteHabit={handleDeleteHabit}
                  onViewStats={() => handleViewStats(group)}
                  isHabitDueToday={(habit) => isHabitDueOnDate(habit, today)}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <AddHabitModal
        visible={habitModalVisible}
        onClose={() => setHabitModalVisible(false)}
        onAdd={addHabit}
        theme={theme}
        groups={groups}
      />

      <AddGroupModal
        visible={groupModalVisible}
        onClose={() => setGroupModalVisible(false)}
        onAdd={addGroup}
        theme={theme}
      />

      <GroupStatsModal
        visible={statsModalVisible}
        onClose={() => setStatsModalVisible(false)}
        group={selectedGroup}
        stats={selectedGroup ? getGroupStats(selectedGroup.id) : { totalHabits: 0, completionRate: 0, bestStreak: 0, totalCompletions: 0, weeklyCompletions: [0,0,0,0,0,0,0] }}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  addGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  plusIcon: {
    marginLeft: -4,
    marginTop: -8,
  },
  progressCard: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 18,
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  motivational: {
    fontSize: 13,
    fontWeight: '500',
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  addHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  groupsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
