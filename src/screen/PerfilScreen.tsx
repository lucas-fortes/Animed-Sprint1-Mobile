import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PerfilScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Animed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});