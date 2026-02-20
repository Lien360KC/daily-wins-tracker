import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reward } from '../store/habitStore';
import { Theme } from '../theme/colors';

interface RewardCardProps {
  reward: Reward;
  isUnlocked: boolean;
  currentMaxStreak: number;
  theme: Theme;
}

const REWARD_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  star: 'star',
  flame: 'flame',
  trophy: 'trophy',
  medal: 'medal',
  crown: 'ribbon',
  rocket: 'rocket',
  ribbon: 'ribbon',
  diamond: 'diamond',
  gift: 'gift',
  heart: 'heart',
  'thumbs-up': 'thumbs-up',
  happy: 'happy',
  sparkles: 'sparkles',
};

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  isUnlocked,
  currentMaxStreak,
  theme,
}) => {
  const progress = Math.min((currentMaxStreak / reward.streakRequired) * 100, 100);
  const iconName = REWARD_ICONS[reward.icon] || 'star';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isUnlocked ? theme.primaryLight : theme.surface,
          borderColor: isUnlocked ? theme.primary : theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isUnlocked ? theme.primary : theme.surfaceHover,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={26}
          color={isUnlocked ? '#FFFFFF' : theme.textMuted}
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>
            {reward.title}
          </Text>
          {reward.isCustom && (
            <View style={[styles.customBadge, { backgroundColor: theme.accentLight }]}>
              <Text style={[styles.customBadgeText, { color: theme.accent }]}>Custom</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {reward.description}
        </Text>
        
        {!isUnlocked && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: theme.primary },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textMuted }]}>
              {currentMaxStreak}/{reward.streakRequired} days
            </Text>
          </View>
        )}
        
        {isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            <Text style={[styles.unlockedText, { color: theme.success }]}>
              Unlocked!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    minWidth: 55,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
