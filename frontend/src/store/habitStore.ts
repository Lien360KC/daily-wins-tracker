import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, differenceInDays, parseISO, startOfDay, getDay } from 'date-fns';

export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface HabitFrequency {
  type: FrequencyType;
  customDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  groupId: string;
  frequency: HabitFrequency;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  order: number;
}

export interface HabitGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  streakRequired: number;
  icon: string;
  isCustom: boolean;
  unlockedAt?: string;
}

export interface AppSettings {
  isDarkMode: boolean;
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientColors?: string[];
}

interface HabitState {
  habits: Habit[];
  groups: HabitGroup[];
  rewards: Reward[];
  unlockedRewards: string[];
  settings: AppSettings;
  
  // Group actions
  addGroup: (name: string, icon: string, color: string) => void;
  updateGroup: (id: string, updates: Partial<HabitGroup>) => void;
  removeGroup: (id: string) => void;
  reorderGroups: (groupIds: string[]) => void;
  
  // Habit actions
  addHabit: (name: string, icon: string, color: string, groupId: string, frequency: HabitFrequency) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  moveHabit: (habitId: string, newGroupId: string) => void;
  reorderHabit: (habitId: string, direction: 'up' | 'down') => void;
  getHabitsInGroup: (groupId: string) => Habit[];
  
  // Reward actions
  addCustomReward: (title: string, description: string, streakRequired: number, icon: string) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  removeReward: (id: string) => void;
  
  // Settings actions
  toggleDarkMode: () => void;
  setBackground: (type: 'solid' | 'gradient', color: string, gradientColors?: string[]) => void;
  
  // Utility functions
  getHabitCompletionForDate: (id: string, date: string) => boolean;
  isHabitDueOnDate: (habit: Habit, date: string) => boolean;
  getTodayProgress: () => { completed: number; total: number };
  getGroupProgress: (groupId: string) => { completed: number; total: number; percentage: number };
  getGroupStats: (groupId: string) => { 
    totalHabits: number;
    completionRate: number;
    bestStreak: number;
    totalCompletions: number;
    weeklyCompletions: number[];
  };
  checkAndUnlockRewards: () => void;
}

const DEFAULT_GROUPS: HabitGroup[] = [
  { id: 'morning', name: 'Morning Routine', icon: 'sunny', color: '#FBBF24', order: 0 },
  { id: 'study', name: 'Study Habits', icon: 'book', color: '#4D94FF', order: 1 },
  { id: 'night', name: 'Night Routine', icon: 'moon', color: '#A78BFA', order: 2 },
];

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'First Step', description: 'Complete your first habit', streakRequired: 1, icon: 'star', isCustom: false },
  { id: '2', title: 'Getting Started', description: 'Achieve a 3-day streak', streakRequired: 3, icon: 'flame', isCustom: false },
  { id: '3', title: 'Week Warrior', description: 'Achieve a 7-day streak', streakRequired: 7, icon: 'trophy', isCustom: false },
  { id: '4', title: 'Habit Builder', description: 'Achieve a 14-day streak', streakRequired: 14, icon: 'medal', isCustom: false },
  { id: '5', title: 'Unstoppable', description: 'Achieve a 30-day streak', streakRequired: 30, icon: 'ribbon', isCustom: false },
];

const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: true,
  backgroundType: 'solid',
  backgroundColor: '#191919',
};

const isHabitDueOnDateHelper = (habit: Habit, dateStr: string): boolean => {
  const date = parseISO(dateStr);
  const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
  
  switch (habit.frequency.type) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return habit.frequency.customDays?.includes(dayOfWeek) ?? false;
    default:
      return true;
  }
};

const calculateStreak = (completedDates: string[], habit: Habit): { current: number; longest: number } => {
  if (completedDates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  // Check if streak is active (completed today or yesterday, considering frequency)
  const todayDue = isHabitDueOnDateHelper(habit, today);
  const yesterdayDue = isHabitDueOnDateHelper(habit, yesterday);
  const completedToday = sortedDates[0] === today;
  const completedYesterday = sortedDates.includes(yesterday);
  
  const streakActive = completedToday || (yesterdayDue && completedYesterday) || (!todayDue && !yesterdayDue);

  for (const dateStr of sortedDates) {
    const date = startOfDay(parseISO(dateStr));
    
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const dayDiff = differenceInDays(lastDate, date);
      if (dayDiff === 1) {
        tempStreak++;
      } else if (dayDiff > 1) {
        // Check if there were any due days between
        let missedDueDay = false;
        for (let i = 1; i < dayDiff; i++) {
          const checkDate = format(new Date(lastDate.getTime() - i * 86400000), 'yyyy-MM-dd');
          if (isHabitDueOnDateHelper(habit, checkDate)) {
            missedDueDay = true;
            break;
          }
        }
        if (missedDueDay) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        } else {
          tempStreak++;
        }
      }
    }
    lastDate = date;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Current streak calculation
  if (streakActive) {
    tempStreak = 0;
    lastDate = null;
    for (const dateStr of sortedDates) {
      const date = startOfDay(parseISO(dateStr));
      if (lastDate === null) {
        tempStreak = 1;
      } else {
        const dayDiff = differenceInDays(lastDate, date);
        if (dayDiff === 1) {
          tempStreak++;
        } else if (dayDiff > 1) {
          let missedDueDay = false;
          for (let i = 1; i < dayDiff; i++) {
            const checkDate = format(new Date(lastDate.getTime() - i * 86400000), 'yyyy-MM-dd');
            if (isHabitDueOnDateHelper(habit, checkDate)) {
              missedDueDay = true;
              break;
            }
          }
          if (missedDueDay) {
            break;
          } else {
            tempStreak++;
          }
        }
      }
      lastDate = date;
    }
    currentStreak = tempStreak;
  }

  return { current: currentStreak, longest: longestStreak };
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      groups: DEFAULT_GROUPS,
      rewards: DEFAULT_REWARDS,
      unlockedRewards: [],
      settings: DEFAULT_SETTINGS,

      // Group actions
      addGroup: (name, icon, color) => {
        const newGroup: HabitGroup = {
          id: Date.now().toString(),
          name,
          icon,
          color,
          order: get().groups.length,
        };
        set((state) => ({ groups: [...state.groups, newGroup] }));
      },

      updateGroup: (id, updates) => {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
      },

      removeGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          habits: state.habits.filter((h) => h.groupId !== id),
        }));
      },

      reorderGroups: (groupIds) => {
        set((state) => ({
          groups: groupIds.map((id, index) => {
            const group = state.groups.find((g) => g.id === id);
            return group ? { ...group, order: index } : null;
          }).filter(Boolean) as HabitGroup[],
        }));
      },

      // Habit actions
      addHabit: (name, icon, color, groupId, frequency) => {
        const newHabit: Habit = {
          id: Date.now().toString(),
          name,
          icon,
          color,
          groupId,
          frequency,
          completedDates: [],
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      removeHabit: (id) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
      },

      toggleHabitCompletion: (id, date) => {
        set((state) => {
          const updatedHabits = state.habits.map((habit) => {
            if (habit.id === id) {
              const isCompleted = habit.completedDates.includes(date);
              const newCompletedDates = isCompleted
                ? habit.completedDates.filter((d) => d !== date)
                : [...habit.completedDates, date];
              
              const { current, longest } = calculateStreak(newCompletedDates, habit);
              
              return {
                ...habit,
                completedDates: newCompletedDates,
                currentStreak: current,
                longestStreak: longest,
              };
            }
            return habit;
          });
          return { habits: updatedHabits };
        });
        get().checkAndUnlockRewards();
      },

      // Reward actions
      addCustomReward: (title, description, streakRequired, icon) => {
        const newReward: Reward = {
          id: Date.now().toString(),
          title,
          description,
          streakRequired,
          icon,
          isCustom: true,
        };
        set((state) => ({ rewards: [...state.rewards, newReward] }));
      },

      updateReward: (id, updates) => {
        set((state) => ({
          rewards: state.rewards.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      removeReward: (id) => {
        set((state) => ({
          rewards: state.rewards.filter((r) => r.id !== id),
          unlockedRewards: state.unlockedRewards.filter((rId) => rId !== id),
        }));
      },

      // Settings actions
      toggleDarkMode: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            isDarkMode: !state.settings.isDarkMode,
            backgroundColor: !state.settings.isDarkMode ? '#191919' : '#FFFFFF',
          },
        }));
      },

      setBackground: (type, color, gradientColors) => {
        set((state) => ({
          settings: {
            ...state.settings,
            backgroundType: type,
            backgroundColor: color,
            gradientColors,
          },
        }));
      },

      // Utility functions
      getHabitCompletionForDate: (id, date) => {
        const habit = get().habits.find((h) => h.id === id);
        return habit?.completedDates.includes(date) ?? false;
      },

      isHabitDueOnDate: (habit, date) => {
        return isHabitDueOnDateHelper(habit, date);
      },

      getTodayProgress: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const habits = get().habits.filter((h) => isHabitDueOnDateHelper(h, today));
        const completed = habits.filter((h) => h.completedDates.includes(today)).length;
        return { completed, total: habits.length };
      },

      getGroupProgress: (groupId) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const groupHabits = get().habits.filter(
          (h) => h.groupId === groupId && isHabitDueOnDateHelper(h, today)
        );
        const completed = groupHabits.filter((h) => h.completedDates.includes(today)).length;
        const total = groupHabits.length;
        return {
          completed,
          total,
          percentage: total > 0 ? (completed / total) * 100 : 0,
        };
      },

      getGroupStats: (groupId) => {
        const groupHabits = get().habits.filter((h) => h.groupId === groupId);
        const totalHabits = groupHabits.length;
        
        // Calculate completion rate (last 30 days)
        let totalDue = 0;
        let totalCompleted = 0;
        const weeklyCompletions = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
        
        for (let i = 0; i < 30; i++) {
          const date = format(new Date(Date.now() - i * 86400000), 'yyyy-MM-dd');
          const dayOfWeek = getDay(parseISO(date));
          
          for (const habit of groupHabits) {
            if (isHabitDueOnDateHelper(habit, date)) {
              totalDue++;
              if (habit.completedDates.includes(date)) {
                totalCompleted++;
                if (i < 7) {
                  weeklyCompletions[dayOfWeek]++;
                }
              }
            }
          }
        }
        
        const completionRate = totalDue > 0 ? (totalCompleted / totalDue) * 100 : 0;
        const bestStreak = Math.max(...groupHabits.map((h) => h.longestStreak), 0);
        const totalCompletions = groupHabits.reduce((acc, h) => acc + h.completedDates.length, 0);
        
        return {
          totalHabits,
          completionRate,
          bestStreak,
          totalCompletions,
          weeklyCompletions,
        };
      },

      checkAndUnlockRewards: () => {
        const { habits, rewards, unlockedRewards } = get();
        const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
        
        const newUnlocked = rewards
          .filter((r) => maxStreak >= r.streakRequired && !unlockedRewards.includes(r.id))
          .map((r) => r.id);
        
        if (newUnlocked.length > 0) {
          set((state) => ({
            unlockedRewards: [...state.unlockedRewards, ...newUnlocked],
          }));
        }
      },
    }),
    {
      name: 'habit-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
