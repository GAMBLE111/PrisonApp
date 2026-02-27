import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Report Detail
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Report ID: {id}
      </Text>
      <View style={styles.placeholder}>
        <Text variant="bodySmall" style={styles.placeholderText}>
          Detailed report view will be implemented here with full data
          breakdown, charts, and export options.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
  },
  placeholder: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
  },
});
