import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { RewardCard } from '../../src/components/RewardCard';

export default function RewardsScreen() {
  const { habits, rewards, unlockedRewards, isDarkMode } = useHabitStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
  const totalUnlocked = unlockedRewards.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Rewards</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Unlock achievements by building streaks
          </Text>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="flame" size={24} color={theme.warning} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{maxStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Best Streak</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="trophy" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{totalUnlocked}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Unlocked</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.successLight }]}>
              <Ionicons name="star" size={24} color={theme.success} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{rewards.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
          </View>
        </View>

        {/* Rewards List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isUnlocked={unlockedRewards.includes(reward.id)}
              currentMaxStreak={maxStreak}
              theme={theme}
            />
          ))}
        </View>

        {/* Motivational Section */}
        {maxStreak === 0 && (
          <View style={[styles.motivationalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="rocket" size={40} color={theme.primary} />
            <Text style={[styles.motivationalTitle, { color: theme.text }]}>
              Start Your Journey!
            </Text>
            <Text style={[styles.motivationalText, { color: theme.textSecondary }]}>
              Complete your habits daily to build streaks and unlock rewards. 
              Every day counts!
            </Text>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 60,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  motivationalCard: {
    margin: 20,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  motivationalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
