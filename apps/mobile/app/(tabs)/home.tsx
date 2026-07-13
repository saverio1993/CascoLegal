import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleShortcutPress = (topic: string) => {
    router.push({
      pathname: '/(tabs)/chat',
      params: { preQuery: topic }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>¡Hola, Conductor!</Text>
          <Text style={styles.subtitle}>Consulta Legal de Tránsito de Panamá</Text>
        </View>
      </View>

      {/* Main search bar trigger */}
      <TouchableOpacity 
        style={styles.searchTrigger}
        onPress={() => router.push('/(tabs)/chat')}
      >
        <Text style={styles.searchPlaceholder}>¿Es obligatorio usar chaleco...?</Text>
      </TouchableOpacity>

      {/* Fast Access Grid */}
      <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridCard} onPress={() => handleShortcutPress('chaleco')}>
          <Text style={styles.cardIcon}>🦺</Text>
          <Text style={styles.cardTitle}>Chalecos</Text>
          <Text style={styles.cardDesc}>Normas de reflectivos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard} onPress={() => handleShortcutPress('delivery')}>
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>Delivery</Text>
          <Text style={styles.cardDesc}>Rotulación de placa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard} onPress={() => handleShortcutPress('licencia')}>
          <Text style={styles.cardIcon}>🪪</Text>
          <Text style={styles.cardTitle}>Licencias</Text>
          <Text style={styles.cardDesc}>Categorías Tipo B</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard} onPress={() => handleShortcutPress('retencion')}>
          <Text style={styles.cardIcon}>🚧</Text>
          <Text style={styles.cardTitle}>Retenciones</Text>
          <Text style={styles.cardDesc}>Causales de grúa</Text>
        </TouchableOpacity>
      </View>

      {/* Specialty Cards */}
      <TouchableOpacity 
        style={[styles.promoCard, { borderLeftColor: '#3B82F6' }]}
        onPress={() => router.push('/(tabs)/verifier')}
      >
        <View style={styles.promoIconContainer}>
          <Text style={styles.promoIcon}>🔍</Text>
        </View>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Verificador de Rumores</Text>
          <Text style={styles.promoDesc}>¿Escuchaste sobre una ley? Compruébala con el reglamento oficial.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.promoCard, { borderLeftColor: '#EF4444' }]}
        onPress={() => router.push({
          pathname: '/agent-mode',
          params: { articleId: '33333333-3333-3333-3333-333333333304' }
        })}
      >
        <View style={[styles.promoIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
          <Text style={styles.promoIcon}>🚓</Text>
        </View>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Modo Mostrar al Agente</Text>
          <Text style={styles.promoDesc}>Ficha limpia y de alto contraste para operativos de control vial.</Text>
        </View>
      </TouchableOpacity>

      {/* Recents */}
      <Text style={styles.sectionTitle}>Últimas Normas Aprobadas</Text>
      <View style={styles.lawList}>
        <View style={styles.lawCard}>
          <View style={styles.lawHeader}>
            <Text style={styles.lawNum}>Decreto 19 de 2022</Text>
            <Text style={styles.lawBadge}>Vigente</Text>
          </View>
          <Text style={styles.lawTitle}>Artículo 40-A: Cajas y Delivery</Text>
          <Text style={styles.lawBody}>Establece las especificaciones de rotulado de placa de 7cm en color rojo sobre fondo blanco reflectivo.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    marginTop: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchTrigger: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  searchPlaceholder: {
    color: '#64748B',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 10,
    fontFamily: 'System',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 14,
    padding: 12,
    width: '48%',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 12,
  },
  promoCard: {
    backgroundColor: '#151E33',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  promoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promoIcon: {
    fontSize: 18,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  promoDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  lawList: {
    marginTop: 4,
  },
  lawCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#24355A',
  },
  lawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lawNum: {
    fontSize: 10,
    color: '#94A3B8',
  },
  lawBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  lawTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lawBody: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 15,
  },
});
