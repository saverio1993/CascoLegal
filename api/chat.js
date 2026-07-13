const MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';
const API_URL = process.env.MINIMAX_API_URL || 'https://api.minimax.io/v1/chat/completions';

function cleanModelText(value) {
  return String(value || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'El chat no está configurado. Añade MINIMAX_API_KEY en Vercel.' });

  try {
    const { messages, context } = req.body || {};
    const cleanMessages = Array.isArray(messages)
      ? messages.filter(m => ['user', 'model', 'assistant'].includes(m?.role) && typeof m?.text === 'string')
          .slice(-12).map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.text.slice(0, 4000) }))
      : [];
    if (!cleanMessages.length || cleanMessages.at(-1).role !== 'user') {
      return res.status(400).json({ error: 'Debes enviar una pregunta.' });
    }

    const safeContext = Array.isArray(context) ? context.slice(0, 6).map(item => ({
      document: String(item?.document || '').slice(0, 160),
      article: String(item?.article || '').slice(0, 40),
      content: String(item?.content || '').slice(0, 2500),
    })) : [];
    const systemInstruction = `Eres CascoLegal, asistente informativo sobre tránsito de motocicletas en Panamá.
Responde en español, con claridad y brevedad. Usa únicamente el contexto legal proporcionado.
No inventes leyes, multas, artículos ni interpretaciones. Si el contexto no responde la pregunta, di exactamente:
"No encontré una disposición oficial en la base de datos de CascoLegal que regule esto."
Cuando exista fundamento, menciona el documento y el artículo. Aclara que la respuesta es informativa y no sustituye asesoría legal.

Contexto legal indexado:
${JSON.stringify(safeContext)}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: systemInstruction }, ...cleanMessages],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('MiniMax API error:', response.status, data?.error?.message || data?.base_resp?.status_msg || 'unknown');
      return res.status(502).json({ error: 'No se pudo consultar MiniMax en este momento.' });
    }
    const text = cleanModelText(data?.choices?.[0]?.message?.content);
    if (!text) return res.status(502).json({ error: 'Gemini devolvió una respuesta vacía.' });
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'No se pudo procesar la consulta.' });
  }
};
