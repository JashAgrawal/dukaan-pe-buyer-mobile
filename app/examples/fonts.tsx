import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import FontExample from '@/components/examples/FontExample';
import { Typography } from '@/components/ui/Typography';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function FontsExampleScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={24} 
          color="#000" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Typography variant="h4" weight="bold">Font Examples</Typography>
      </View>
      
      <FontExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
});
