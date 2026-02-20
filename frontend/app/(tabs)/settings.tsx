import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../src/store/habitStore';
import { lightTheme, darkTheme } from '../../src/theme/colors';
import { BackgroundPicker } from '../../src/components/BackgroundPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [backgroundPickerVisible, setBackgroundPickerVisible] = useState(false);
  const { habits, groups, settings, toggleDarkMode, setBackground } = useHabitStore();
  const theme = settings.isDarkMode ? darkTheme : lightTheme;

  const totalDaysTracked = habits.reduce(
    (acc, habit) => acc + habit.completedDates.length,
    0
  );

  const totalStreaks = habits.reduce((acc, habit) => acc + habit.currentStreak, 0);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your habits, groups, progress, and unlocked rewards. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            useHabitStore.persist.clearStorage();
            Alert.alert('Done', 'All data has been reset. Please restart the app.');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    rightComponent,
    onPress,
    danger,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: danger ? theme.dangerLight : theme.surfaceHover,
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={danger ? theme.danger : theme.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            { color: danger ? theme.danger : theme.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Stats Overview */}
        <View style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statsTitle, { color: theme.textSecondary }]}>
            YOUR JOURNEY
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {habits.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Habits
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {groups.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Groups
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {totalDaysTracked}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Tracked
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {totalStreaks}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Streaks
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            APPEARANCE
          </Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingItem
              icon={settings.isDarkMode ? 'moon' : 'sunny'}
              title="Dark Mode"
              subtitle="Reduce eye strain in low light"
              rightComponent={
                <Switch
                  value={settings.isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              icon="color-palette"
              title="Background"
              subtitle="Customize app background"
              onPress={() => setBackgroundPickerVisible(true)}
              rightComponent={
                <View style={[styles.colorPreview, { backgroundColor: settings.backgroundColor, borderColor: theme.border }]} />
              }
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DATA
          </Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingItem
              icon="cloud-done"
              title="Data Storage"
              subtitle="Saved locally on this device"
            />
            <SettingItem
              icon="trash"
              title="Reset All Data"
              subtitle="Delete all habits and progress"
              onPress={handleResetData}
              danger
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ABOUT
          </Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingItem
              icon="information-circle"
              title="Daily Wins"
              subtitle="Version 2.0.0"
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={[styles.tipsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="bulb" size={24} color={theme.warning} />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, { color: theme.text }]}>Pro Tips</Text>
            <Text style={[styles.tipsText, { color: theme.textSecondary }]}>
              {'\u2022'} Group habits by time of day for better organization{'\n'}
              {'\u2022'} Start small with 2-3 habits and build up{'\n'}
              {'\u2022'} Check habits as soon as you complete them{'\n'}
              {'\u2022'} Celebrate your streaks to stay motivated!
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Build better habits, one day at a time.
          </Text>
        </View>
      </ScrollView>

      <BackgroundPicker
        visible={backgroundPickerVisible}
        onClose={() => setBackgroundPickerVisible(false)}
        onSelect={(type, color, gradientColors) => {
          setBackground(type, color, gradientColors);
          setBackgroundPickerVisible(false);
        }}
        currentColor={settings.backgroundColor}
        theme={theme}
        isDarkMode={settings.isDarkMode}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  colorPreview: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
  },
  tipsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
