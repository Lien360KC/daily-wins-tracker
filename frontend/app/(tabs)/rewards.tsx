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
import { Ionicons } from '@expo/vector-icons';\nimport { useHabitStore } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { RewardCard } from '../../src/components/RewardCard';
import { AddRewardModal } from '../../src/components/AddRewardModal';

export default function RewardsScreen() {
  const [addRewardVisible, setAddRewardVisible] = useState(false);
  const { habits, rewards, unlockedRewards, settings, addCustomReward, removeReward } = useHabitStore();
  const theme = settings.isDarkMode ? darkTheme : lightTheme;

  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
  const totalUnlocked = unlockedRewards.length;

  const sortedRewards = [...rewards].sort((a, b) => a.streakRequired - b.streakRequired);

  const handleDeleteReward = (id: string, title: string, isCustom: boolean) => {
    if (!isCustom) {
      Alert.alert('Cannot Delete', 'Default rewards cannot be deleted.');
      return;
    }
    
    Alert.alert(
      'Delete Reward',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeReward(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Rewards</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Unlock achievements by building streaks
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setAddRewardVisible(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
          {sortedRewards.map((reward) => (
            <TouchableOpacity
              key={reward.id}
              onLongPress={() => handleDeleteReward(reward.id, reward.title, reward.isCustom)}
              delayLongPress={500}
            >
              <RewardCard
                reward={reward}
                isUnlocked={unlockedRewards.includes(reward.id)}
                currentMaxStreak={maxStreak}
                theme={theme}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Rewards Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="bulb" size={24} color={theme.warning} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Create Your Own Rewards</Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Tap the + button to add custom rewards. Set your own milestones and treat yourself!
            </Text>
            <Text style={[styles.infoHint, { color: theme.textMuted }]}>
              Long press a custom reward to delete it.
            </Text>
          </View>
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

      <AddRewardModal
        visible={addRewardVisible}
        onClose={() => setAddRewardVisible(false)}
        onAdd={addCustomReward}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
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
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoHint: {
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
  },
  motivationalCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 100,
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
