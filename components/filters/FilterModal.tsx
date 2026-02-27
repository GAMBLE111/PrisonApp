import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Modal, Portal, List, Divider, Text, IconButton } from 'react-native-paper';
import { FILTER_OPTIONS, FILTER_LABELS } from '@/constants/filters';

interface FilterModalProps {
  visible: boolean;
  field: string;
  currentValue?: string;
  onSelect: (value: string | undefined) => void;
  onDismiss: () => void;
}

export default function FilterModal({
  visible,
  field,
  currentValue,
  onSelect,
  onDismiss,
}: FilterModalProps) {
  const options = FILTER_OPTIONS[field] || [];
  const label = FILTER_LABELS[field] || field;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text variant="titleMedium" style={styles.title}>
          Select {label}
        </Text>
        <Divider />
        <ScrollView style={styles.list}>
          <List.Item
            title="All"
            onPress={() => onSelect(undefined)}
            right={(props) =>
              !currentValue ? <List.Icon {...props} icon="check" /> : null
            }
          />
          {options.map((option) => (
            <List.Item
              key={option}
              title={option}
              onPress={() => onSelect(option)}
              right={(props) =>
                currentValue === option ? (
                  <List.Icon {...props} icon="check" />
                ) : null
              }
            />
          ))}
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 12,
    maxHeight: '70%',
  },
  title: {
    padding: 16,
  },
  list: {
    maxHeight: 400,
  },
});
