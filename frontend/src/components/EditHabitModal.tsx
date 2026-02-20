import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';
import { Habit, HabitGroup, HabitFrequency, FrequencyType } from '../store/habitStore';

interface EditHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Habit>) => void;
  onDelete: (id: string) => void;
  onMove: (habitId: string, newGroupId: string) => void;
  habit: Habit | null;
  groups: HabitGroup[];
  theme: Theme;
}

const ICONS = [
  'water', 'fitness', 'bed', 'moon', 'sunny',
  'rainy', 'brush', 'school', 'trash', 'home',
  'grid', 'shirt', 'phone-portrait',
  'book', 'library', 'pencil', 'document-text', 'laptop',
  'barbell', 'bicycle', 'walk', 'heart', 'nutrition', 'medkit',
  'cafe', 'leaf', 'musical-notes', 'game-controller', 'camera',
  'code-slash', 'desktop', 'call', 'mail',
];

const COLORS = [
  '#4D94FF', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
  '#F472B6', '#60A5FA', '#22D3EE', '#FB923C', '#84CC16',
  '#8B5CF6', '#EC4899', '#14B8A6', '#EF4444', '#6366F1',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  onMove,
  habit,
  groups,
  theme,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSelectedIcon(habit.icon);
      setSelectedColor(habit.color);
      setSelectedGroupId(habit.groupId);
      setFrequencyType(habit.frequency.type);
      setCustomDays(habit.frequency.customDays || [1, 2, 3, 4, 5]);
    }
  }, [habit]);

  const handleSave = () => {
    if (!habit || !name.trim()) return;
    
    const frequency: HabitFrequency = {
      type: frequencyType,
      customDays: frequencyType === 'custom' ? customDays : undefined,
    };
    
    // Check if group changed
    if (selectedGroupId !== habit.groupId) {
      onMove(habit.id, selectedGroupId);
    }
    
    onSave(habit.id, {
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      frequency,
    });
    
    onClose();
  };

  const handleDelete = () => {
    if (!habit) return;
    
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? All progress will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(habit.id);
            onClose();
          },
        },
      ]
    );
  };

  const toggleDay = (dayIndex: number) => {
    setCustomDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  const getFrequencyLabel = (type: FrequencyType) => {
    switch (type) {
      case 'daily': return 'Every day';
      case 'weekdays': return 'Weekdays';
      case 'weekends': return 'Weekends';
      case 'custom': return 'Custom';
    }
  };

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Edit Habit</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Habit Name */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Habit Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., Drink 8 glasses of water"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Group Selection (Move Habit) */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Move to Group</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupOption,
                    {
                      backgroundColor: selectedGroupId === group.id ? group.color + '20' : theme.surface,
                      borderColor: selectedGroupId === group.id ? group.color : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedGroupId(group.id)}
                >
                  <Ionicons name={group.icon as any} size={18} color={group.color} />
                  <Text style={[styles.groupText, { color: selectedGroupId === group.id ? group.color : theme.text }]}>
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Frequency Selection */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Frequency</Text>
            <View style={styles.frequencyGrid}>
              {(['daily', 'weekdays', 'weekends', 'custom'] as FrequencyType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.frequencyOption,
                    {
                      backgroundColor: frequencyType === type ? selectedColor + '20' : theme.surface,
                      borderColor: frequencyType === type ? selectedColor : theme.border,
                    },
                  ]}
                  onPress={() => setFrequencyType(type)}
                >
                  <Text style={[styles.frequencyText, { color: frequencyType === type ? selectedColor : theme.text }]}>
                    {getFrequencyLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Days Selection */}
            {frequencyType === 'custom' && (
              <View style={styles.daysContainer}>
                <View style={styles.daysGrid}>
                  {DAYS.map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayOption,
                        {
                          backgroundColor: customDays.includes(index) ? selectedColor : theme.surface,
                          borderColor: customDays.includes(index) ? selectedColor : theme.border,
                        },
                      ]}
                      onPress={() => toggleDay(index)}
                    >
                      <Text style={[styles.dayText, { color: customDays.includes(index) ? '#FFFFFF' : theme.text }]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Icon Selection */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor: selectedIcon === icon ? selectedColor + '20' : theme.surface,
                      borderColor: selectedIcon === icon ? selectedColor : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons
                    name={icon as any}
                    size={18}
                    color={selectedIcon === icon ? selectedColor : theme.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.dangerLight }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color={theme.danger} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: selectedColor, opacity: name.trim() ? 1 : 0.5 }]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  groupScroll: {
    marginBottom: 16,
  },
  groupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    gap: 6,
  },
  groupText: {
    fontSize: 13,
    fontWeight: '500',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  frequencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  frequencyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  dayOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
