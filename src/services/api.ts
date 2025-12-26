import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.100.16:8000',
  timeout: 60000, // 60 segundos para procesamiento de imagen
});

export const estimarPesoVaca = async (fotoUri: string): Promise<number> => {
  console.log('[API] Iniciando estimación de peso...');
  console.log('[API] URI de foto:', fotoUri);
  
  const formData = new FormData();
  
  // Extraer el nombre del archivo desde la URI
  const filename = fotoUri.split('/').pop() || 'vaca.jpg';
  console.log('[API] Nombre de archivo:', filename);
  
  // @ts-ignore - FormData acepta objetos tipo File/Blob en React Native
  formData.append('image', {
    uri: fotoUri,
    type: 'image/jpeg',
    name: filename,
  });

  try {
    console.log('[API] Enviando petición a:', api.defaults.baseURL + '/api/v1/vacas/estimar-peso/');
    
    const response = await api.post('/api/v1/vacas/estimar-peso/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[API] Respuesta recibida:', response.data);
    
    const pesoEstimado = response.data.peso_estimado_kg;
    
    if (typeof pesoEstimado !== 'number') {
      throw new Error(`Peso estimado inválido: ${pesoEstimado}`);
    }

    // Guardar en historial local
    await guardarEnHistorial(fotoUri, pesoEstimado);

    return pesoEstimado;
  } catch (error: any) {
    console.error('[API] Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
    throw error;
  }
};

const guardarEnHistorial = async (fotoUri: string, pesoEstimado: number) => {
  try {
    const historialStr = await AsyncStorage.getItem('historial_estimaciones');
    const historial = historialStr ? JSON.parse(historialStr) : [];
    
    const nuevaEstimacion = {
      id: Date.now().toString(),
      fotoUri,
      pesoEstimado,
      fecha: new Date().toISOString(),
    };

    historial.unshift(nuevaEstimacion); // Agregar al inicio
    
    // Mantener solo las últimas 50 estimaciones
    const historialLimitado = historial.slice(0, 50);
    
    await AsyncStorage.setItem('historial_estimaciones', JSON.stringify(historialLimitado));
  } catch (error) {
    console.error('Error al guardar en historial:', error);
  }
};

export default api;
