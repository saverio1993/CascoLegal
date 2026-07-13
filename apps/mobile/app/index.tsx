import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>CL</Text>
        </View>
        <Text style={styles.title}>CascoLegal</Text>
        <Text style={styles.slogan}>“Un ciudadano informado conoce y defiende sus derechos”</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Regla de Hierro Informativa</Text>
        <Text style={styles.cardText}>
          Toda la información expuesta por la IA o las consultas proviene estrictamente de las Gacetas Oficiales y resoluciones vigentes de la República de Panamá. No inventamos regulaciones ni sanciones.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={styles.buttonText}>Aceptar y Continuar</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Esta es una herramienta informativa. No constituye asesoría jurídica formal.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  slogan: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginVertical: 40,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
});
