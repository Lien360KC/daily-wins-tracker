import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';

interface BackgroundPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'solid' | 'gradient', color: string, gradientColors?: string[]) => void;
  currentColor: string;
  theme: Theme;
  isDarkMode: boolean;
}

const SOLID_COLORS_DARK = [
  '#191919', '#1a1a2e', '#16213e', '#0f3460', '#1b1b2f',
  '#1f1f38', '#2d132c', '#1e3d59', '#17252a', '#1c1c27',
];

const SOLID_COLORS_LIGHT = [
  '#FFFFFF', '#F7F7F7', '#F0F4F8', '#E8F4F8', '#FFF8F0',
  '#F8F0FF', '#F0FFF4', '#FFF0F5', '#F5F5DC', '#E6E6FA',
];

const GRADIENTS = [
  { name: 'Midnight', colors: ['#232526', '#414345'] },
  { name: 'Ocean', colors: ['#1a2a6c', '#2d3a8c'] },
  { name: 'Forest', colors: ['#134e5e', '#1a5b50'] },
  { name: 'Sunset', colors: ['#2d1f3d', '#44355B'] },
  { name: 'Aurora', colors: ['#1f4037', '#294840'] },
  { name: 'Cosmic', colors: ['#2b1055', '#3a1c71'] },
];

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  visible,
  onClose,
  onSelect,
  currentColor,
  theme,
  isDarkMode,
}) => {
  const solidColors = isDarkMode ? SOLID_COLORS_DARK : SOLID_COLORS_LIGHT;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Background</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Solid Colors</Text>
            <View style={styles.colorGrid}>
              {solidColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color, borderColor: theme.border },
                    currentColor === color && styles.colorSelected,
                  ]}
                  onPress={() => onSelect('solid', color)}
                >
                  {currentColor === color && (
                    <Ionicons name="checkmark" size={20} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {isDarkMode && (
              <>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Gradients</Text>
                <View style={styles.gradientGrid}>
                  {GRADIENTS.map((gradient) => (
                    <TouchableOpacity
                      key={gradient.name}
                      style={[
                        styles.gradientOption,
                        { borderColor: theme.border },
                      ]}
                      onPress={() => onSelect('gradient', gradient.colors[0], gradient.colors)}
                    >
                      <View style={[styles.gradientPreview, { backgroundColor: gradient.colors[0] }]}>
                        <View style={[styles.gradientOverlay, { backgroundColor: gradient.colors[1] }]} />
                      </View>
                      <Text style={[styles.gradientName, { color: theme.textSecondary }]}>
                        {gradient.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '70%',
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
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#4D94FF',
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gradientOption: {
    width: '30%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
  },
  gradientPreview: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  gradientName: {
    fontSize: 11,
    marginTop: 6,
  },
});
