// src/screens/MenuRegistroScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuRegistroScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Hero section con icono de vaca */}
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf-outline" size={40} color="#4a7c59" />
        </View>
        <Text style={styles.welcome}>Bienvenido a</Text>
        <Text style={styles.appName}>VacaMetric</Text>
        <Text style={styles.tagline}>Estimación de peso bovino inteligente</Text>
      </View>

      {/* Opciones principales */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.cardPrimary]} 
          onPress={() => navigation.navigate('TomarFotoVaca')}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="camera" size={48} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Estimar Peso</Text>
          <Text style={styles.cardSubtitle}>Toma una foto de tu vaca</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardSecondary]} 
          onPress={() => navigation.navigate('Historial')}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="list" size={48} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Historial</Text>
          <Text style={styles.cardSubtitle}>Ver estimaciones previas</Text>
        </TouchableOpacity>
      </View>

      {/* Info footer */}
      <View style={styles.infoFooter}>
        <Ionicons name="information-circle-outline" size={20} color="#6b8e23" />
        <Text style={styles.infoText}>Sistema de estimación basado en IA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcome: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2d5016',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#6b8e23',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPrimary: {
    backgroundColor: '#4a7c59',
  },
  cardSecondary: {
    backgroundColor: '#6b8e23',
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 24,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b8e23',
  }
});
