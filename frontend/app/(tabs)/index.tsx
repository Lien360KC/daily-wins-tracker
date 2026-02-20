import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useHabitStore, HabitGroup, Habit } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { ProgressRing } from '../../src/components/ProgressRing';
import { AddHabitModal } from '../../src/components/AddHabitModal';
import { AddGroupModal } from '../../src/components/AddGroupModal';
import { EditGroupModal } from '../../src/components/EditGroupModal';
import { EditHabitModal } from '../../src/components/EditHabitModal';
import { GroupSection } from '../../src/components/GroupSection';
import { GroupStatsModal } from '../../src/components/GroupStatsModal';
import { CelebrationEffect, CelebrationRef } from '../../src/components/CelebrationEffect';

export default function TodayScreen() {
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [editHabitModalVisible, setEditHabitModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<HabitGroup | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [showExpandedProgress, setShowExpandedProgress] = useState(false);
  
  const celebrationRef = useRef<CelebrationRef>(null);
  
  const {
    habits,
    groups,
    settings,
    addHabit,
    addGroup,
    updateGroup,
    removeGroup,
    updateHabit,
    removeHabit,
    moveHabit,
    reorderHabit,
    toggleHabitCompletion,
    getTodayProgress,
    getGroupProgress,
    getGroupStats,
    isHabitDueOnDate,
    getHabitsInGroup,
  } = useHabitStore();

  const theme = settings.isDarkMode ? darkTheme : lightTheme;
  const today = format(new Date(), 'yyyy-MM-dd');
  const { completed, total } = getTodayProgress();
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // Check for 100% completion and trigger celebration
  useEffect(() => {
    if (progress === 100 && total > 0 && !hasShownCelebration) {
      celebrationRef.current?.fire();
      setHasShownCelebration(true);
    }
    if (progress < 100) {
      setHasShownCelebration(false);
    }
  }, [progress, total, hasShownCelebration]);

  const handleViewStats = (group: HabitGroup) => {
    setSelectedGroup(group);
    setStatsModalVisible(true);
  };

  const handleEditGroup = (group: HabitGroup) => {
    setSelectedGroup(group);
    setEditGroupModalVisible(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitModalVisible(true);
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
      <CelebrationEffect ref={celebrationRef} />
      
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

        {/* Progress Card - Expandable */}
        <TouchableOpacity 
          style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => setShowExpandedProgress(!showExpandedProgress)}
          activeOpacity={0.8}
        >
          <View style={styles.progressContent}>
            <ProgressRing
              progress={progress}
              size={85}
              strokeWidth={9}
              backgroundColor={theme.border}
              progressColor={progress === 100 ? theme.success : theme.primary}
            >
              <Text style={[styles.progressPercent, { color: progress === 100 ? theme.success : theme.text }]}>
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
              <Text style={[styles.motivational, { color: progress === 100 ? theme.success : theme.primary }]}>
                {getMotivationalMessage()}
              </Text>
            </View>
            <Ionicons 
              name={showExpandedProgress ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={theme.textMuted} 
            />
          </View>

          {/* Expanded Group Progress */}
          {showExpandedProgress && (
            <View style={[styles.expandedProgress, { borderTopColor: theme.border }]}>
              <Text style={[styles.expandedTitle, { color: theme.textSecondary }]}>
                PROGRESS BY GROUP
              </Text>
              {sortedGroups.map((group) => {
                const groupProgress = getGroupProgress(group.id);
                return (
                  <View key={group.id} style={styles.groupProgressItem}>
                    <View style={styles.groupProgressHeader}>
                      <View style={[styles.groupIconSmall, { backgroundColor: group.color + '20' }]}>
                        <Ionicons name={group.icon as any} size={14} color={group.color} />
                      </View>
                      <Text style={[styles.groupProgressName, { color: theme.text }]} numberOfLines={1}>
                        {group.name}
                      </Text>
                      <Text style={[styles.groupProgressCount, { color: theme.textSecondary }]}>
                        {groupProgress.completed}/{groupProgress.total}
                      </Text>
                    </View>
                    <View style={[styles.groupProgressBar, { backgroundColor: theme.border }]}>
                      <View 
                        style={[
                          styles.groupProgressFill, 
                          { 
                            width: `${groupProgress.percentage}%`, 
                            backgroundColor: groupProgress.percentage === 100 ? theme.success : group.color 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>

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
              const groupHabits = getHabitsInGroup(group.id);
              const groupProgress = getGroupProgress(group.id);
              
              return (
                <GroupSection
                  key={group.id}
                  group={group}
                  habits={groupHabits}
                  theme={theme}
                  progress={groupProgress}
                  onToggleHabit={(habitId) => toggleHabitCompletion(habitId, today)}
                  onEditHabit={handleEditHabit}
                  onMoveHabitUp={(habitId) => reorderHabit(habitId, 'up')}
                  onMoveHabitDown={(habitId) => reorderHabit(habitId, 'down')}
                  onViewStats={() => handleViewStats(group)}
                  onEditGroup={() => handleEditGroup(group)}
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

      <EditGroupModal
        visible={editGroupModalVisible}
        onClose={() => setEditGroupModalVisible(false)}
        onSave={updateGroup}
        onDelete={removeGroup}
        group={selectedGroup}
        theme={theme}
      />

      <EditHabitModal
        visible={editHabitModalVisible}
        onClose={() => setEditHabitModalVisible(false)}
        onSave={updateHabit}
        onDelete={removeHabit}
        onMove={moveHabit}
        habit={selectedHabit}
        groups={groups}
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  motivational: {
    fontSize: 12,
    fontWeight: '500',
  },
  expandedProgress: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  groupProgressItem: {
    marginBottom: 12,
  },
  groupProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  groupProgressName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  groupProgressCount: {
    fontSize: 12,
    marginLeft: 8,
  },
  groupProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  groupProgressFill: {
    height: '100%',
    borderRadius: 3,
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
