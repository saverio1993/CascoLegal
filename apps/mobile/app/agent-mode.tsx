import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LOCAL_DATABASE } from '../src/services/ragService';

export default function AgentModeScreen() {
  const params = useLocalSearchParams<{ articleId: string }>();
  const router = useRouter();
  
  const article = LOCAL_DATABASE.find(art => art.id === params.articleId) || LOCAL_DATABASE[3];

  const handleOpenPdf = () => {
    Linking.openURL(article.gazetteUrl).catch(err => console.error("No se pudo abrir el enlace", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>USO EN OPERATIVO DE CONTROL</Text>
        <Text style={styles.headerTitle}>VIGENCIA OFICIAL VERIFICADA</Text>
      </View>

      <View style={styles.displayCard}>
        <View>
          <Text style={styles.docTitle}>{article.documentType} N° {article.documentNumber}</Text>
          <Text style={styles.artTitle}>Artículo {article.articleNumber}: {article.title}</Text>
          <Text style={styles.artBody}>{article.content}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerSource}>Gaceta Oficial N° {article.gazetteNumber}</Text>
          <Text style={styles.badge}>VIGENTE</Text>
        </View>
      </View>

      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.pdfButton} onPress={handleOpenPdf}>
          <Text style={styles.pdfButtonText}>📄 Abrir PDF de la Gaceta Oficial</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          "Esta información proviene de fuentes oficiales del Estado Panameño. Puede escanear el documento oficial para validar su veracidad jurídica."
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Cerrar y Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05080F',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 2,
  },
  displayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginVertical: 16,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  docTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  artTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  artBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1E293B',
    fontWeight: '500',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSource: {
    fontSize: 10,
    color: '#64748B',
  },
  badge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionCard: {
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#3B82F6',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
