import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, differenceInDays, parseISO, startOfDay } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  streakRequired: number;
  icon: string;
  unlockedAt?: string;
}

interface HabitState {
  habits: Habit[];
  rewards: Reward[];
  unlockedRewards: string[];
  isDarkMode: boolean;
  addHabit: (name: string, icon: string, color: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  toggleDarkMode: () => void;
  getHabitCompletionForDate: (id: string, date: string) => boolean;
  getTodayProgress: () => { completed: number; total: number };
  checkAndUnlockRewards: () => void;
}

const DEFAULT_REWARDS: Reward[] = [
  { id: '1', title: 'First Step', description: 'Complete your first habit', streakRequired: 1, icon: 'star' },
  { id: '2', title: 'Getting Started', description: 'Achieve a 3-day streak', streakRequired: 3, icon: 'flame' },
  { id: '3', title: 'Week Warrior', description: 'Achieve a 7-day streak', streakRequired: 7, icon: 'trophy' },
  { id: '4', title: 'Habit Builder', description: 'Achieve a 14-day streak', streakRequired: 14, icon: 'medal' },
  { id: '5', title: 'Unstoppable', description: 'Achieve a 30-day streak', streakRequired: 30, icon: 'crown' },
  { id: '6', title: 'Legend', description: 'Achieve a 60-day streak', streakRequired: 60, icon: 'rocket' },
];

const calculateStreak = (completedDates: string[]): { current: number; longest: number } => {
  if (completedDates.length === 0) return { current: 0, longest: 0 };

  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  // Check if streak is active (completed today or yesterday)
  const streakActive = sortedDates[0] === today || sortedDates[0] === yesterday;

  for (const dateStr of sortedDates) {
    const date = startOfDay(parseISO(dateStr));
    
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const dayDiff = differenceInDays(lastDate, date);
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
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
        } else {
          break;
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
      rewards: DEFAULT_REWARDS,
      unlockedRewards: [],
      isDarkMode: true,

      addHabit: (name, icon, color) => {
        const newHabit: Habit = {
          id: Date.now().toString(),
          name,
          icon,
          color,
          completedDates: [],
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
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
              
              const { current, longest } = calculateStreak(newCompletedDates);
              
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

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      getHabitCompletionForDate: (id, date) => {
        const habit = get().habits.find((h) => h.id === id);
        return habit?.completedDates.includes(date) ?? false;
      },

      getTodayProgress: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const habits = get().habits;
        const completed = habits.filter((h) => h.completedDates.includes(today)).length;
        return { completed, total: habits.length };
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
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
