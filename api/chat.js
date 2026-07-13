const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'El chat no está configurado. Añade GEMINI_API_KEY en Vercel.' });

  try {
    const { messages, context } = req.body || {};
    const cleanMessages = Array.isArray(messages)
      ? messages.filter(m => ['user', 'model'].includes(m?.role) && typeof m?.text === 'string')
          .slice(-12).map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, 4000) }] }))
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction }] }, contents: cleanMessages }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', response.status, data?.error?.message || 'unknown');
      return res.status(502).json({ error: 'No se pudo consultar Gemini en este momento.' });
    }
    const text = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'Gemini devolvió una respuesta vacía.' });
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'No se pudo procesar la consulta.' });
  }
};
