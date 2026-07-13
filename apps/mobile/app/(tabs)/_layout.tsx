import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        headerStyle: {
          backgroundColor: '#1A365D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'System',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          headerTitle: 'CascoLegal Panamá',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Asistente IA',
          headerTitle: 'Consulta Inteligente',
        }}
      />
      <Tabs.Screen
        name="verifier"
        options={{
          title: 'Verificador',
          headerTitle: 'Verificador de Rumores',
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          headerTitle: 'Leyes e Infracciones',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111A2E',
    borderTopWidth: 1,
    borderTopColor: '#24355A',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
