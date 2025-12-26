import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import CustomHeader from '../components/CustomHeader';
import Footer from '../components/Footer';

import MenuRegistroScreen from '../screens/MenuRegistroScreen';
import TomarFotoVacaScreen from '../screens/TomarFotoVacaScreen';
import HistorialScreen from '../screens/HistorialScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <CustomHeader title="VacaMetric" subtitle="Estimación de peso bovino" />
        <View style={styles.content}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MenuRegistro">
            <Stack.Screen name="MenuRegistro" component={MenuRegistroScreen} />
            <Stack.Screen name="TomarFotoVaca" component={TomarFotoVacaScreen} />
            <Stack.Screen name="Historial" component={HistorialScreen} />
          </Stack.Navigator>
        </View>
        <Footer />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppNavigator;
