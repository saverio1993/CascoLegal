const {
  mergeSnapshot,
  readSnapshot,
  scanLatestGazettes,
  writeSnapshot,
} = require('../_lib/legispan');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Metodo no permitido.' });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return res.status(503).json({ error: 'CRON_SECRET no esta configurado.' });
  if (req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  try {
    const previous = await readSnapshot({ useCache: false });
    const scan = await scanLatestGazettes({ limit: 40 });
    const snapshot = mergeSnapshot(previous, scan);
    const blob = await writeSnapshot(snapshot);

    return res.status(200).json({
      ok: true,
      checkedAt: snapshot.checkedAt,
      newMatches: scan.items.length,
      storedItems: snapshot.items.length,
      stats: snapshot.stats,
      storagePath: blob.pathname,
    });
  } catch (error) {
    console.error('Legispan cron error:', error);
    return res.status(500).json({ error: 'Fallo el monitoreo diario de Legispan.' });
  }
};
