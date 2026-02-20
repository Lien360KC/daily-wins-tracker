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
import { HabitGroup } from '../store/habitStore';

interface EditGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<HabitGroup>) => void;
  onDelete: (id: string) => void;
  group: HabitGroup | null;
  theme: Theme;
}

const ICONS = [
  'sunny', 'moon', 'star', 'heart', 'fitness', 'book',
  'school', 'briefcase', 'home', 'leaf', 'musical-notes',
  'game-controller', 'brush', 'camera', 'code-slash', 'cafe',
  'bed', 'alarm', 'bicycle', 'walk', 'restaurant', 'water',
];

const COLORS = [
  '#FBBF24', '#A78BFA', '#4D94FF', '#34D399', '#F87171',
  '#F472B6', '#60A5FA', '#22D3EE', '#FB923C', '#84CC16',
];

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  group,
  theme,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setSelectedIcon(group.icon);
      setSelectedColor(group.color);
    }
  }, [group]);

  const handleSave = () => {
    if (name.trim() && group) {
      onSave(group.id, {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (!group) return;
    
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"? All habits in this group will also be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(group.id);
            onClose();
          },
        },
      ]
    );
  };

  if (!group) return null;

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
            <Text style={[styles.title, { color: theme.text }]}>Edit Group</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Group Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., Morning Routine"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />

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
                    size={22}
                    color={selectedIcon === icon ? selectedColor : theme.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
