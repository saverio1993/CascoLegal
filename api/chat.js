const MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';
const API_URL = process.env.MINIMAX_API_URL || 'https://api.minimax.io/v1/chat/completions';
const { rankLegispanUpdates, readSnapshot } = require('./_lib/legispan');

function cleanModelText(value) {
  return String(value || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
}

function toLegispanContext(item) {
  return {
    id: String(item?.id || ''),
    document: `${item?.normType || 'Norma'} N° ${item?.normNumber || 'S/N'}`,
    article: `Gaceta Oficial N° ${item?.gazetteNumber || 'S/N'}`,
    title: String(item?.title || '').slice(0, 420),
    content: String(item?.summary || '').slice(0, 2200),
    publishedAt: item?.gazettePublishedAt || item?.publishedAt || null,
    sourceUrl: String(item?.sourceUrl || ''),
  };
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
    let legispanContext = [];
    try {
      const snapshot = await readSnapshot();
      legispanContext = rankLegispanUpdates(snapshot, cleanMessages.at(-1).content, 3).map(toLegispanContext);
    } catch (error) {
      // La base legal local sigue disponible aunque Legispan esté temporalmente inaccesible.
      console.warn('No se pudo leer el historial de Legispan:', error?.message || error);
    }

    const systemInstruction = `Eres CascoLegal, asistente informativo sobre tránsito de motocicletas en Panamá.
Responde en español, con claridad y brevedad. Usa únicamente el contexto legal proporcionado.
No inventes leyes, multas, artículos ni interpretaciones. Si el contexto no responde la pregunta, di exactamente:
"No encontré una disposición oficial en la base de datos de CascoLegal que regule esto."
Cuando exista fundamento, menciona el documento y el artículo o Gaceta. Aclara que la respuesta es informativa y no sustituye asesoría legal.
El contexto de Legispan contiene novedades detectadas automáticamente: úsalo solo para lo que su título o resumen diga expresamente. Si falta el detalle exacto, indícalo y remite a la ficha oficial; no completes artículos, multas ni requisitos por inferencia.

Base legal indexada de CascoLegal:
${JSON.stringify(safeContext)}

Actualizaciones oficiales de Legispan relevantes para esta consulta:
${JSON.stringify(legispanContext)}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: systemInstruction }, ...cleanMessages],
        temperature: 0.2,
        max_tokens: 700,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('MiniMax API error:', response.status, data?.error?.message || data?.base_resp?.status_msg || 'unknown');
      return res.status(502).json({ error: 'No se pudo consultar MiniMax en este momento.' });
    }
    const text = cleanModelText(data?.choices?.[0]?.message?.content);
    if (!text) return res.status(502).json({ error: 'MiniMax devolvió una respuesta vacía.' });
    return res.status(200).json({
      text,
      sources: {
        legispan: legispanContext.map(source => ({
          id: source.id,
          document: source.document,
          gazette: source.article,
          title: source.title,
          publishedAt: source.publishedAt,
          sourceUrl: source.sourceUrl,
        })),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'No se pudo procesar la consulta.' });
  }
};
