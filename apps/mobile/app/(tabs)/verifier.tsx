import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { verifyClaim, FactCheckResult } from '../../src/services/ragService';

export default function VerifierScreen() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const handleVerify = () => {
    const text = inputText.trim();
    if (!text) return;
    const checkResult = verifyClaim(text);
    setResult(checkResult);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmada':
        return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', text: 'CONFIRMADA' };
      case 'parcialmente_confirmada':
        return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', text: 'PARCIAL' };
      case 'contradicha':
        return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', text: 'CONTRADICHA' };
      default:
        return { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)', text: 'NO CONFIRMADA' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Verificador de Rumores</Text>
      <Text style={styles.subtitle}>
        Comprueba si un rumor vial, advertencia o supuesta multa que te dijo un oficial o leíste en redes sociales tiene respaldo legal.
      </Text>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe la afirmación. Ej: 'Es obligatorio llevar extintor en la moto en Panamá y te pueden retener el vehículo si no lo portas.'"
          placeholderTextColor="#64748B"
        />
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verificar Afirmación</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>Diagnóstico:</Text>
            <View style={[styles.badge, { backgroundColor: getStatusStyle(result.status).bg }]}>
              <Text style={[styles.badgeText, { color: getStatusStyle(result.status).color }]}>
                {getStatusStyle(result.status).text}
              </Text>
            </View>
          </View>

          <Text style={styles.explanationTitle}>Análisis de CascoLegal:</Text>
          <Text style={styles.explanationText}>{result.explanation}</Text>

          {result.evidences.length > 0 && (
            <View style={styles.evidenceContainer}>
              <Text style={styles.evidenceLabel}>Evidencia Oficial:</Text>
              {result.evidences.map((ev, idx) => (
                <View key={idx} style={styles.evidenceCard}>
                  <Text style={styles.evidenceSource}>{ev.sourceName} - Art. {ev.articleNumber}</Text>
                  <Text style={styles.evidenceContent}>"{ev.content}"</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
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
  inputCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 14,
    padding: 14,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 12,
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#151E33',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#24355A',
    paddingBottom: 10,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 17,
  },
  evidenceContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#24355A',
    paddingTop: 10,
  },
  evidenceLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 6,
  },
  evidenceCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 8,
    padding: 10,
  },
  evidenceSource: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  evidenceContent: {
    fontSize: 9.5,
    color: '#94A3B8',
    lineHeight: 14,
    fontStyle: 'italic',
  },
});
