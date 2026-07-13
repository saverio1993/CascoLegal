const { readSnapshot } = require('./_lib/legispan');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Metodo no permitido.' });
  }

  try {
    const snapshot = await readSnapshot();
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).json(snapshot || {
      version: 1,
      source: 'Legispan - Asamblea Nacional de Panama',
      sourceUrl: 'https://legispan.asamblea.gob.pa/tabloids',
      checkedAt: null,
      items: [],
      stats: null,
    });
  } catch (error) {
    console.error('Latest laws read error:', error);
    return res.status(503).json({ error: 'No se pudo leer el monitoreo legal en este momento.' });
  }
};
