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
import { Reward } from '../store/habitStore';

interface EditRewardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Reward>) => void;
  onDelete: (id: string) => void;
  reward: Reward | null;
  theme: Theme;
}

const ICONS = [
  'star', 'trophy', 'medal', 'ribbon', 'flame', 'rocket',
  'diamond', 'gift', 'heart', 'thumbs-up', 'happy', 'sparkles',
];

const STREAK_OPTIONS = [1, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90, 100];

export const EditRewardModal: React.FC<EditRewardModalProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  reward,
  theme,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streakRequired, setStreakRequired] = useState(7);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  useEffect(() => {
    if (reward) {
      setTitle(reward.title);
      setDescription(reward.description);
      setStreakRequired(reward.streakRequired);
      setSelectedIcon(reward.icon);
    }
  }, [reward]);

  const handleSave = () => {
    if (title.trim() && description.trim() && reward) {
      onSave(reward.id, {
        title: title.trim(),
        description: description.trim(),
        streakRequired,
        icon: selectedIcon,
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (!reward) return;
    
    Alert.alert(
      'Delete Reward',
      `Are you sure you want to delete "${reward.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(reward.id);
            onClose();
          },
        },
      ]
    );
  };

  if (!reward) return null;

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
            <Text style={[styles.title, { color: theme.text }]}>Edit Reward</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Reward Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., Gaming Night"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., 2 hours of video games"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={[styles.label, { color: theme.textSecondary }]}>Days Required</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.streakScroll}>
              {STREAK_OPTIONS.map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.streakOption,
                    {
                      backgroundColor: streakRequired === days ? theme.primary + '20' : theme.surface,
                      borderColor: streakRequired === days ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setStreakRequired(days)}
                >
                  <Text style={[styles.streakText, { color: streakRequired === days ? theme.primary : theme.text }]}>
                    {days}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: theme.textSecondary }]}>Icon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    {
                      backgroundColor: selectedIcon === icon ? theme.warning + '20' : theme.surface,
                      borderColor: selectedIcon === icon ? theme.warning : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons
                    name={icon as any}
                    size={22}
                    color={selectedIcon === icon ? theme.warning : theme.textSecondary}
                  />
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
              style={[styles.saveButton, { backgroundColor: theme.primary, opacity: title.trim() && description.trim() ? 1 : 0.5 }]}
              onPress={handleSave}
              disabled={!title.trim() || !description.trim()}
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
    maxHeight: '85%',
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
    marginBottom: 16,
  },
  streakScroll: {
    marginBottom: 16,
  },
  streakOption: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 10,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
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
