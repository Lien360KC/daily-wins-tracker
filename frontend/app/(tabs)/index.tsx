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
import { useHabitStore } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { HabitCard } from '../../src/components/HabitCard';
import { ProgressRing } from '../../src/components/ProgressRing';
import { AddHabitModal } from '../../src/components/AddHabitModal';

export default function TodayScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    habits,
    isDarkMode,
    addHabit,
    removeHabit,
    toggleHabitCompletion,
    getTodayProgress,
  } = useHabitStore();

  const theme = isDarkMode ? darkTheme : lightTheme;
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

  const getMotivationalMessage = () => {
    if (total === 0) return "Add your first habit to get started!";
    if (completed === total) return "You crushed it today! 🔥";
    if (progress >= 50) return "Keep going, you're doing great!";
    return "Let's build some momentum!";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>Daily Wins</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.progressContent}>
            <ProgressRing
              progress={progress}
              size={100}
              strokeWidth={10}
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

        {/* Habits Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Habits</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {habits.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="list" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No habits yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "Add" to create your first daily habit
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                theme={theme}
                onToggle={() => toggleHabitCompletion(habit.id, today)}
                onDelete={() => handleDeleteHabit(habit.id, habit.name)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
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
  progressCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 20,
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '700',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  motivational: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
