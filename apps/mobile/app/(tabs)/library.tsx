import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LOCAL_DATABASE } from '../../src/services/ragService';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const router = useRouter();

  const handleOpenPdf = (url: string) => {
    Linking.openURL(url).catch(err => console.error("No se pudo abrir el enlace", err));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Biblioteca de Normas</Text>
      <Text style={styles.subtitle}>
        Consulta los decretos, resoluciones y artículos oficiales que rigen la circulación de motocicletas en la República de Panamá.
      </Text>

      <View style={styles.list}>
        {LOCAL_DATABASE.map(art => (
          <View key={art.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.docType}>
                {art.documentType} N° {art.documentNumber}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Vigente</Text>
              </View>
            </View>

            <Text style={styles.artNum}>Artículo {art.articleNumber}: {art.title}</Text>
            <Text style={styles.artContent}>{art.content}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => router.push({
                  pathname: '/agent-mode',
                  params: { articleId: art.id }
                })}
              >
                <Text style={styles.actionBtnText}>🚔 Modo Agente</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, styles.pdfBtn]}
                onPress={() => handleOpenPdf(art.gazetteUrl)}
              >
                <Text style={styles.actionBtnText}>📄 Ver PDF Oficial</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 14,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  docType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  artNum: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  artContent: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  actionBtn: {
    backgroundColor: '#151E33',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pdfBtn: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
