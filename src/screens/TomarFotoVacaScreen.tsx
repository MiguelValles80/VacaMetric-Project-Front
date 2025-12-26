// src/screens/TomarFotoVacaScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { estimarPesoVaca } from '../services/api';

export default function TomarFotoVacaScreen() {
  const [fotoVaca, setFotoVaca] = useState<string | null>(null);
  const [estimando, setEstimando] = useState(false);
  const [pesoEstimado, setPesoEstimado] = useState<number | null>(null);

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para usar la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: 'images' as any,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoVaca(result.assets[0].uri);
        setPesoEstimado(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  const seleccionarGaleria = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: 'images' as any,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoVaca(result.assets[0].uri);
        setPesoEstimado(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto.');
    }
  };

  const estimarPeso = async () => {
    if (!fotoVaca) {
      Alert.alert('Sin foto', 'Primero toma o selecciona una foto de la vaca.');
      return;
    }

    setEstimando(true);
    try {
      const peso = await estimarPesoVaca(fotoVaca);
      setPesoEstimado(peso);
    } catch (error: any) {
      console.error('Error al estimar peso:', error);
      const mensaje = error.response?.data?.message 
        || error.message 
        || 'Error de conexión. Verifica que el servidor esté corriendo en http://127.0.0.1:8000';
      Alert.alert('Error de Conexión', mensaje);
    } finally {
      setEstimando(false);
    }
  };

  const nuevaEstimacion = () => {
    setFotoVaca(null);
    setPesoEstimado(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {!fotoVaca ? (
        <>
          {/* Estado inicial - sin foto */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="camera-outline" size={80} color="#4a7c59" />
            </View>
            <Text style={styles.emptyTitle}>Captura una imagen</Text>
            <Text style={styles.emptySubtitle}>
              Toma una foto clara de tu vaca para obtener una estimación precisa del peso
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.bigBtn, styles.btnCamera]} onPress={tomarFoto}>
              <Ionicons name="camera" size={32} color="#fff" />
              <Text style={styles.bigBtnText}>Abrir Cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bigBtn, styles.btnGallery]} onPress={seleccionarGaleria}>
              <Ionicons name="images" size={32} color="#fff" />
              <Text style={styles.bigBtnText}>Galería</Text>
            </TouchableOpacity>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={24} color="#6b8e23" />
              <Text style={styles.tipsTitle}>Consejos para mejores resultados</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4a7c59" />
              <Text style={styles.tipText}>Toma la foto de perfil completo</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4a7c59" />
              <Text style={styles.tipText}>Asegura buena iluminación natural</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4a7c59" />
              <Text style={styles.tipText}>Mantén distancia de 2-3 metros</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4a7c59" />
              <Text style={styles.tipText}>Evita sombras pronunciadas</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Estado con foto */}
          <View style={styles.photoContainer}>
            <Image source={{ uri: fotoVaca }} style={styles.fotoPreview} />
          </View>

          {estimando && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a7c59" />
              <Text style={styles.loadingText}>Analizando imagen...</Text>
              <Text style={styles.loadingSubtext}>Esto puede tomar unos segundos</Text>
            </View>
          )}

          {pesoEstimado !== null && !estimando && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Peso Estimado</Text>
              <View style={styles.resultValueContainer}>
                <Text style={styles.resultValue}>{(typeof pesoEstimado === 'number' ? pesoEstimado : parseFloat(pesoEstimado)).toFixed(1)}</Text>
                <Text style={styles.resultUnit}>kg</Text>
              </View>
              <View style={styles.resultBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4a7c59" />
                <Text style={styles.resultBadgeText}>Análisis completado</Text>
              </View>
            </View>
          )}

          <View style={styles.actionsContainer}>
            {!estimando && pesoEstimado === null && (
              <TouchableOpacity style={[styles.bigBtn, styles.btnEstimar]} onPress={estimarPeso}>
                <Ionicons name="analytics" size={28} color="#fff" />
                <Text style={styles.bigBtnText}>Estimar Peso</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.bigBtn, styles.btnSecondary]} 
              onPress={nuevaEstimacion}
              disabled={estimando}
            >
              <Ionicons name="refresh" size={28} color="#fff" />
              <Text style={styles.bigBtnText}>Nueva Foto</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  contentContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d5016',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  btnCamera: {
    backgroundColor: '#4a7c59',
  },
  btnGallery: {
    backgroundColor: '#6b8e23',
  },
  btnEstimar: {
    backgroundColor: '#2e7d32',
  },
  btnSecondary: {
    backgroundColor: '#8b9474',
  },
  bigBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6b8e23',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d5016',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  photoContainer: {
    marginBottom: 20,
  },
  fotoPreview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4a7c59',
    shadowColor: '#4a7c59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#4a7c59',
  },
  resultUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6b8e23',
    marginLeft: 8,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a7c59',
  },
  actionsContainer: {
    gap: 12,
  },
});
