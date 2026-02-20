import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';
import { HabitGroup } from '../store/habitStore';

interface GroupStatsModalProps {
  visible: boolean;
  onClose: () => void;
  group: HabitGroup | null;
  stats: {
    totalHabits: number;
    completionRate: number;
    bestStreak: number;
    totalCompletions: number;
    weeklyCompletions: number[];
  };
  theme: Theme;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const GroupStatsModal: React.FC<GroupStatsModalProps> = ({
  visible,
  onClose,
  group,
  stats,
  theme,
}) => {
  if (!group) return null;

  const maxWeekly = Math.max(...stats.weeklyCompletions, 1);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <View style={[styles.iconContainer, { backgroundColor: group.color + '20' }]}>
                <Ionicons name={group.icon as any} size={24} color={group.color} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{group.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="list" size={24} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalHabits}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Habits</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="checkmark-circle" size={24} color={theme.success} />
                <Text style={[styles.statValue, { color: theme.text }]}>{Math.round(stats.completionRate)}%</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completion Rate</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="flame" size={24} color={theme.warning} />
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.bestStreak}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Best Streak</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="trophy" size={24} color={group.color} />
                <Text style={[styles.statValue, { color: theme.text }]}>{stats.totalCompletions}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completions</Text>
              </View>
            </View>

            {/* Weekly Chart */}
            <View style={[styles.chartContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>This Week</Text>
              <View style={styles.chartBars}>
                {stats.weeklyCompletions.map((count, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${(count / maxWeekly) * 100}%`,
                            backgroundColor: group.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: theme.textMuted }]}>{DAYS[index]}</Text>
                    <Text style={[styles.barValue, { color: theme.textSecondary }]}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tips */}
            <View style={[styles.tipsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.tipsTitle, { color: theme.text }]}>Tips</Text>
              {stats.completionRate < 50 && (
                <Text style={[styles.tip, { color: theme.textSecondary }]}>
                  Try breaking down habits into smaller steps to improve completion rate.
                </Text>
              )}
              {stats.completionRate >= 50 && stats.completionRate < 80 && (
                <Text style={[styles.tip, { color: theme.textSecondary }]}>
                  Great progress! Keep up the momentum and aim for consistency.
                </Text>
              )}
              {stats.completionRate >= 80 && (
                <Text style={[styles.tip, { color: theme.textSecondary }]}>
                  Excellent work! You're building strong habits. Consider adding new challenges.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: 24,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipsContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tip: {
    fontSize: 14,
    lineHeight: 20,
  },
});
