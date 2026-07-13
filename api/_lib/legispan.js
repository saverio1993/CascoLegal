const { get, put } = require('@vercel/blob');

const LEGISPAN_API_URL = 'https://legispan.asamblea.gob.pa/api/search/gazette';
const LEGISPAN_SITE_URL = 'https://legispan.asamblea.gob.pa';
const SNAPSHOT_PATH = 'cascolegal/latest-motorcycle-laws.json';
const ATTT_AUTHORITY_IDS = new Set([
  '761c6eb8-24d0-4a26-b2b1-daecc584c808',
]);

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function hasMotorcycleTerm(text) {
  return /\bmotociclet\w*\b|\bmotocicl\w*\b|\bciclomotor\w*\b|\bmotonet\w*\b|\bmotos?\b|\b(?:tri|cuadri)cicl\w*\s+a\s+motor\b/.test(text);
}

function referencesKnownMotorcycleRule(text) {
  const numberPrefix = '(?:\\s+n(?:o|umero|°|º)?\\.?)?\\s*';
  return new RegExp(`decreto(?:\\s+ejecutivo)?${numberPrefix}640\\b`).test(text)
    || new RegExp(`decreto(?:\\s+ejecutivo)?${numberPrefix}19\\b.{0,30}\\b2022\\b`).test(text)
    || new RegExp(`resolucion(?:\\s+oal)?${numberPrefix}(?:904|945|973)\\b`).test(text);
}

function isMotorcycleNorm(norm) {
  const title = normalizeText(norm?.title);
  const content = normalizeText(norm?.content);
  const titleHasMotorcycle = hasMotorcycleTerm(title);
  const bodyHasMotorcycle = hasMotorcycleTerm(content);
  const knownRule = referencesKnownMotorcycleRule(title) || referencesKnownMotorcycleRule(content);
  const isAttt = ATTT_AUTHORITY_IDS.has(String(norm?.authorityId || ''));
  const trafficTitle = /transito|transporte terrestre|seguridad vial|circulacion|vehicular|conductores?|licencias? de conducir|placa/.test(title);
  const regulatoryTitle = /establec|reglament|modific|subrog|prohib|oblig|requisit|disposicion|norma|sancion|uso de|conductores?/.test(title);
  const operativeBody = /conductores?\s+de\s+motocic|motociclet\w*.{0,220}(casco|chaleco|placa|licencia|circulacion|transito|velocidad|seguridad)|(?:casco|chaleco|placa|licencia|circulacion|transito|velocidad|seguridad).{0,220}motociclet/.test(content);

  if (knownRule) return true;
  if (titleHasMotorcycle && (regulatoryTitle || trafficTitle || isAttt)) return true;
  return bodyHasMotorcycle && operativeBody && (trafficTitle || isAttt);
}

function cleanDisplayText(value, maxLength = 320) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}

function extractRelevantSnippet(content, fallbackTitle) {
  const raw = String(content || '').replace(/\s+/g, ' ').trim();
  const normalized = normalizeText(raw);
  const match = normalized.match(/\bmotociclet\w*\b|\bmotocicl\w*\b|\bciclomotor\w*\b|\bmotonet\w*\b|\bmotos?\b/);
  if (!match) return cleanDisplayText(fallbackTitle, 360);

  const start = Math.max(0, match.index - 120);
  const end = Math.min(raw.length, match.index + 430);
  let snippet = raw.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < raw.length) snippet = `${snippet}…`;
  return cleanDisplayText(snippet, 520);
}

function inferNormType(norm) {
  const nomenclature = typeof norm?.nomenclature === 'string' ? norm.nomenclature.trim() : '';
  if (nomenclature) return nomenclature;

  try {
    const decodedPath = decodeURIComponent(new URL(norm?.normUrl || '').pathname);
    const match = decodedPath.match(/\/NORMAS\/\d{4}\/\d{4}\/([^/]+)\//i);
    if (match?.[1]) return match[1].replace(/%20/g, ' ');
  } catch (_) {
    // La ficha de Legispan sigue siendo util aunque no se pueda inferir el tipo.
  }

  return 'Norma';
}

function toPublicItem(norm, gazette, detectedAt) {
  return {
    id: String(norm.id),
    normNumber: cleanDisplayText(norm.number || 'S/N', 60),
    normType: cleanDisplayText(inferNormType(norm), 80),
    title: cleanDisplayText(norm.title || 'Norma relacionada con motocicletas', 420),
    summary: extractRelevantSnippet(norm.content, norm.title),
    publishedAt: norm.publishedAt || null,
    gazetteNumber: cleanDisplayText(gazette.number || 'S/N', 40),
    gazettePublishedAt: gazette.publishedAt || null,
    sourceUrl: `${LEGISPAN_SITE_URL}/norms/${encodeURIComponent(norm.id)}`,
    pdfUrl: norm.normUrl || gazette.url || null,
    detectedAt,
  };
}

async function fetchJson(url, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CascoLegal/1.0 (+https://cascolegal.vercel.app)',
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Legispan respondio HTTP ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function scanLatestGazettes({ limit = 40 } = {}) {
  const query = new URLSearchParams({
    page: '1',
    limit: String(limit),
    sortKey: 'publishedAt',
    sortOrder: 'desc',
  });
  const payload = await fetchJson(`${LEGISPAN_API_URL}?${query}`);
  const gazettes = Array.isArray(payload?.data)
    ? payload.data.map(entry => entry?.original).filter(Boolean)
    : [];
  const detectedAt = new Date().toISOString();
  const items = [];
  let normsChecked = 0;

  for (const gazette of gazettes) {
    const norms = Array.isArray(gazette.norms) ? gazette.norms : [];
    normsChecked += norms.length;
    for (const norm of norms) {
      if (!norm?.id || !isMotorcycleNorm(norm)) continue;
      items.push(toPublicItem(norm, gazette, detectedAt));
    }
  }

  const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values())
    .sort((a, b) => String(b.gazettePublishedAt || b.publishedAt || '').localeCompare(String(a.gazettePublishedAt || a.publishedAt || '')));

  return {
    items: uniqueItems,
    stats: {
      gazettesChecked: gazettes.length,
      normsChecked,
      matchesFound: uniqueItems.length,
      latestGazetteDate: gazettes[0]?.publishedAt || null,
    },
  };
}

function hasBlobCredentials() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID));
}

async function readSnapshot({ useCache = true } = {}) {
  if (!hasBlobCredentials()) return null;
  try {
    const result = await get(SNAPSHOT_PATH, { access: 'public', useCache });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return await new Response(result.stream).json();
  } catch (error) {
    if (error?.name === 'BlobNotFoundError' || /not found/i.test(error?.message || '')) return null;
    throw error;
  }
}

async function writeSnapshot(snapshot) {
  if (!hasBlobCredentials()) throw new Error('Vercel Blob no esta configurado.');
  return put(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 300,
  });
}

function mergeSnapshot(previous, scan) {
  const priorItems = Array.isArray(previous?.items) ? previous.items : [];
  const freshItems = Array.isArray(scan?.items) ? scan.items : [];
  const items = Array.from(new Map([...freshItems, ...priorItems].map(item => [item.id, item])).values())
    .sort((a, b) => String(b.gazettePublishedAt || b.publishedAt || '').localeCompare(String(a.gazettePublishedAt || a.publishedAt || '')))
    .slice(0, 24);

  return {
    version: 1,
    source: 'Legispan - Asamblea Nacional de Panama',
    sourceUrl: `${LEGISPAN_SITE_URL}/tabloids`,
    checkedAt: new Date().toISOString(),
    items,
    stats: scan.stats,
  };
}

const QUERY_STOP_WORDS = new Set([
  'para', 'como', 'sobre', 'donde', 'cuando', 'cual', 'cuales', 'quien', 'quienes',
  'desde', 'hasta', 'entre', 'tiene', 'tienen', 'puedo', 'puede', 'quiero', 'necesito',
  'dime', 'diga', 'dice', 'esta', 'esto', 'esa', 'ese', 'estos', 'estas', 'una', 'uno',
  'unos', 'unas', 'que', 'por', 'con', 'sin', 'del', 'las', 'los', 'sus', 'hay', 'son',
]);

function getQueryTerms(query) {
  return Array.from(new Set(normalizeText(query)
    .split(/[^a-z0-9]+/)
    .filter(term => term.length >= 3 && !QUERY_STOP_WORDS.has(term))));
}

function rankLegispanUpdates(snapshot, query, limit = 3) {
  const items = Array.isArray(snapshot?.items) ? snapshot.items : [];
  const normalizedQuery = normalizeText(query);
  const terms = getQueryTerms(query);
  const asksAboutMotorcycles = /\bmoto|motocic|ciclomotor|motonet|tricicl/.test(normalizedQuery);
  const asksAboutUpdates = /ultima|reciente|nueva|novedad|gaceta|legispan|actualiza/.test(normalizedQuery);

  const ranked = items.map(item => {
    const title = normalizeText(`${item.normType || ''} ${item.normNumber || ''} ${item.title || ''}`);
    const summary = normalizeText(item.summary);
    const metadata = normalizeText(`gaceta ${item.gazetteNumber || ''} ${item.gazettePublishedAt || ''}`);
    let score = 0;
    let specificScore = 0;

    for (const term of terms) {
      if (title.includes(term)) { score += 8; specificScore += 8; }
      if (summary.includes(term)) { score += 4; specificScore += 4; }
      if (metadata.includes(term)) { score += 5; specificScore += 5; }
    }
    if (asksAboutMotorcycles) score += 1;
    if (asksAboutUpdates) score += 1;

    return { item, score, specificScore };
  });
  const hasSpecificMatch = ranked.some(result => result.specificScore > 0);

  return ranked.filter(result => result.score > 0 && (!hasSpecificMatch || result.specificScore > 0))
    .sort((a, b) => b.score - a.score || String(b.item.gazettePublishedAt || '').localeCompare(String(a.item.gazettePublishedAt || '')))
    .slice(0, Math.max(1, Math.min(limit, 5)))
    .map(result => result.item);
}

module.exports = {
  isMotorcycleNorm,
  mergeSnapshot,
  rankLegispanUpdates,
  readSnapshot,
  scanLatestGazettes,
  writeSnapshot,
};
