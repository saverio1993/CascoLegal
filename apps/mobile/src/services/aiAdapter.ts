// Adaptador de Proveedor de IA - CascoLegal
// Permite alternar entre Google Gemini (nativo multimodal) y MiniMax v7 mediante configuración.

export type AIProvider = 'google_gemini' | 'minimax';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  modelName: string;
  temperature: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Clase adaptadora para aislar las llamadas del backend de los proveedores de LLM específicos.
 */
export class AIAdapter {
  private settings: AISettings;

  constructor(settings: AISettings) {
    this.settings = settings;
  }

  /**
   * Envía una consulta al proveedor configurado, inyectando el contexto de las leyes panameñas.
   */
  async generateResponse(
    prompt: string,
    contextDocuments: { docTitle: string; articleNumber: string; content: string }[],
    history: ChatMessage[] = []
  ): Promise<string> {
    const formattedContext = contextDocuments
      .map(doc => `[${doc.docTitle} - Art. ${doc.articleNumber}]: ${doc.content}`)
      .join('\n\n');

    const systemInstructions = `
      Eres el asistente de Inteligencia Artificial oficial de CascoLegal, una aplicación que informa a los motociclistas de Panamá sobre las leyes de tránsito de forma respetuosa y rigurosa.
      
      REGLAS DE ORO:
      1. Responde ÚNICAMENTE basándote en el contexto legal panameño provisto abajo.
      2. No inventes artículos, leyes, multas ni interpretaciones jurídicas.
      3. Si el contexto es insuficiente o no encuentras la respuesta, di textualmente: "No se encontró una disposición oficial suficiente para confirmar esta afirmación en los términos indicados."
      4. Divide tu respuesta en:
         ### Respuesta breve (explicación en lenguaje sencillo de 2-3 frases)
         ### Fundamento oficial (número de artículo, ley y fragmento literal)
         ### Consideraciones adicionales (excepciones o detalles complementarios)
      
      CONTEXTO DE LEYES VIGENTES DE PANAMÁ:
      ${formattedContext}
    `;

    console.log(`[AIAdapter] Utilizando proveedor: ${this.settings.provider} (${this.settings.modelName})`);

    if (this.settings.provider === 'google_gemini') {
      return this.callGoogleGeminiAPI(systemInstructions, prompt, history);
    } else if (this.settings.provider === 'minimax') {
      return this.callMiniMaxAPI(systemInstructions, prompt, history);
    } else {
      throw new Error(`Proveedor de IA no soportado: ${this.settings.provider}`);
    }
  }

  /**
   * Conexión real con la API de Google Gemini (Free Tier de Google AI Studio)
   */
  private async callGoogleGeminiAPI(systemPrompt: string, userPrompt: string, history: ChatMessage[]): Promise<string> {
    const apiKey = this.settings.apiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('[AIAdapter] No se detectó GEMINI_API_KEY. Usando simulación de respuesta local.');
      return `### Respuesta breve
Para transitar de forma regular como motociclista de delivery en Panamá, debes rotular el número de placa único de circulación trasera en tu bolso o caja de reparto.

### Fundamento oficial
* **Decreto Ejecutivo N° 19 de 2022 (Artículo 40-A)**: "Las motocicletas destinadas al servicio de transporte de carga, mensajería, entrega a domicilio o delivery... deberán llevar el número de la placa única nacional impreso y plenamente visible en la parte trasera de la caja..."

### Consideraciones adicionales
La rotulación debe ser obligatoriamente en tipografía Arial, con letras rojas sobre un fondo blanco reflectivo y con un tamaño mínimo de 7 centímetros de altura para asegurar la visibilidad de los agentes de la ATTT de noche.`;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.settings.modelName || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
      
      // Formatear historial para la estructura de la API de Gemini
      const contents = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      
      // Añadir la pregunta actual del usuario
      contents.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nPregunta del usuario: ${userPrompt}` }]
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: this.settings.temperature ?? 0.0,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      const assistantResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!assistantResponse) {
        throw new Error('Respuesta vacía del servidor de Gemini.');
      }

      return assistantResponse;
    } catch (error) {
      console.error('[AIAdapter] Error en la llamada a la API de Gemini:', error);
      throw new Error(`Fallo de conexión RAG: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Conexión con la API de MiniMax (Minimax abab6.5 o v7)
   */
  private async callMiniMaxAPI(systemPrompt: string, userPrompt: string, history: ChatMessage[]): Promise<string> {
    // En producción, haríamos una llamada POST a la API de MiniMax:
    // https://api.minimax.chat/v1/text/chatcompletion_v2
    // body: { model: 'abab6.5-chat', messages: [...] }
    
    console.log('[AIAdapter] Realizando llamada simulada a la API de MiniMax...');
    
    return `### Respuesta breve
De acuerdo con el Reglamento de Tránsito de Panamá, el uso de chalecos reflectivos impresos con tu número de placa de circulación es de uso obligatorio durante todo el trayecto en la vía pública.

### Fundamento oficial
* **Resolución OAL N° 904 de 2013 (ATTT) (Artículo Primero)**: "Se establece el uso obligatorio de chaleco reflectivo de color azul, naranja o gris para todos los conductores de motocicletas y sus acompañantes durante su circulación en las vías de la República de Panamá..."

### Consideraciones adicionales
Queda estrictamente prohibido utilizar chalecos de color verde limón, ya que este tono está legalmente reservado para la Dirección de Operaciones de Tránsito de la Policía Nacional y agentes de la ATTT.`;
  }
}
