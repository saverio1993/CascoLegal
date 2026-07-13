import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { queryRAGSystem, RAGResponse } from '../../src/services/ragService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ragData?: RAGResponse;
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{ preQuery?: string }>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola! Soy tu asistente de CascoLegal. ¿Tienes alguna pregunta sobre el reglamento de tránsito, chalecos reflectivos, licencias de moto o delivery?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (params?.preQuery) {
      handleSendMessage(params.preQuery);
    }
  }, [params?.preQuery]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // Agregar mensaje del usuario
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text }]);
    setInputText('');
    setIsLoading(true);

    // Auto-scroll
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Simular tiempo de carga de RAG / LLM
      await new Promise(resolve => setTimeout(resolve, 800));

      const ragResponse = queryRAGSystem(text);
      const assistantMsgId = `asst-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          text: ragResponse.briefAnswer,
          ragData: ragResponse,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          ⚠️ Respuestas generadas estrictamente en base a documentos de la Gaceta Oficial de Panamá.
        </Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(msg => (
          <View 
            key={msg.id} 
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}
          >
            {msg.role === 'assistant' && (
              <Text style={styles.assistantTitle}>Asistente CascoLegal</Text>
            )}
            <Text style={[
              styles.messageText,
              msg.role === 'user' ? styles.userText : styles.assistantText
            ]}>
              {msg.text}
            </Text>

            {/* Citations if available */}
            {msg.ragData && msg.ragData.officialGrounds.length > 0 && (
              <View style={styles.citationsContainer}>
                <Text style={styles.citationHeading}>Fundamento Oficial:</Text>
                {msg.ragData.officialGrounds.map((ground, idx) => (
                  <View key={idx} style={styles.citationCard}>
                    <Text style={styles.citationTitle}>
                      Art. {ground.articleNumber} ({ground.documentType} {ground.documentNumber})
                    </Text>
                    <Text style={styles.citationContent}>"{ground.content}"</Text>
                    <Text style={styles.citationFooter}>
                      Gaceta Oficial N° {ground.gazetteNumber}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Considerations if available */}
            {msg.ragData && msg.ragData.considerations ? (
              <View style={styles.considerationsContainer}>
                <Text style={styles.considerationsTitle}>Consideraciones:</Text>
                <Text style={styles.considerationsText}>{msg.ragData.considerations}</Text>
              </View>
            ) : null}
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <Text style={styles.messageText}>Analizando reglamentos oficiales...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContent}>
          <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage('¿Es obligatorio el chaleco de noche?')}>
            <Text style={styles.chipText}>Chaleco nocturno</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage('¿Qué necesito para hacer delivery?')}>
            <Text style={styles.chipText}>Delivery placa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => handleSendMessage('¿Cuándo se lleva mi moto la grúa?')}>
            <Text style={styles.chipText}>Retención grúa</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu consulta legal..."
          placeholderTextColor="#64748B"
          onSubmitEditing={() => handleSendMessage(inputText)}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => handleSendMessage(inputText)}
        >
          <Text style={styles.sendButtonText}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: '#24355A',
    padding: 10,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#24355A',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  assistantTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#F1F5F9',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#111A2E',
    borderTopWidth: 1,
    borderTopColor: '#24355A',
    padding: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chipsContainer: {
    height: 44,
    backgroundColor: '#0F172A',
  },
  chipsContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: '#24355A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 11,
  },
  citationsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  citationHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 6,
  },
  citationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#24355A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  citationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  citationContent: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 14,
    fontStyle: 'italic',
  },
  citationFooter: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'right',
  },
  considerationsContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  considerationsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 2,
  },
  considerationsText: {
    fontSize: 10.5,
    color: '#cbd5e1',
    lineHeight: 14,
  },
});
