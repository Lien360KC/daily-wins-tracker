import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';
import { HabitGroup, HabitFrequency, FrequencyType } from '../store/habitStore';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, color: string, groupId: string, frequency: HabitFrequency) => void;
  theme: Theme;
  groups: HabitGroup[];
}

const ICONS = [
  // Personal care
  'water', 'fitness', 'bed', 'moon', 'sunny',
  // New requested icons
  'rainy', // shower (closest to shower)
  'brush', // toothbrush (using brush)
  'school', // backpack
  'trash', // garbage can
  'home', // broom (cleaning)
  'grid', // curtains (closest)
  'shirt', // clothing
  'phone-portrait', // cell phone
  // Study & productivity
  'book', 'library', 'pencil', 'document-text', 'laptop',
  // Health & fitness
  'barbell', 'bicycle', 'walk', 'heart', 'nutrition', 'medkit',
  // Lifestyle
  'cafe', 'leaf', 'musical-notes', 'game-controller', 'camera',
  // Tech
  'code-slash', 'desktop', 'call', 'mail',
];

const COLORS = [
  '#4D94FF', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
  '#F472B6', '#60A5FA', '#22D3EE', '#FB923C', '#84CC16',
  '#8B5CF6', '#EC4899', '#14B8A6', '#EF4444', '#6366F1',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onAdd,
  theme,
  groups,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

  const handleAdd = () => {
    if (name.trim() && selectedGroupId) {
      const frequency: HabitFrequency = {
        type: frequencyType,
        customDays: frequencyType === 'custom' ? customDays : undefined,
      };
      onAdd(name.trim(), selectedIcon, selectedColor, selectedGroupId, frequency);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedIcon(ICONS[0]);
    setSelectedColor(COLORS[0]);
    setSelectedGroupId(groups[0]?.id || '');
    setFrequencyType('daily');
    setCustomDays([1, 2, 3, 4, 5]);
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
      case 'weekdays': return 'Weekdays only';
      case 'weekends': return 'Weekends only';
      case 'custom': return 'Custom days';
    }
  };

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
            <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
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

            {/* Group Selection */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>Group</Text>
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
                <Text style={[styles.sublabel, { color: theme.textMuted }]}>Select days</Text>
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
                    size={20}
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
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: selectedColor, opacity: name.trim() ? 1 : 0.5 }]}
            onPress={handleAdd}
            disabled={!name.trim()}
          >
            <Text style={styles.addButtonText}>Add Habit</Text>
          </TouchableOpacity>
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
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sublabel: {
    fontSize: 12,
    marginBottom: 8,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    gap: 8,
  },
  groupText: {
    fontSize: 14,
    fontWeight: '500',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  frequencyOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  dayOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
