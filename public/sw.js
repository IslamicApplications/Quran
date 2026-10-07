/**
 * Offline support. Pages: network first, the saved copy offline. Built files (hashed names): saved when the
 * worker installs, then cache first. Quran text, tafsir, word data and fonts: the saved copy at once, refreshed
 * in the background. Audio: saved whole, with the byte ranges media players ask for cut from the saved file.
 *
 * The build (vite.config.ts) fills in VERSION and PRECACHE, so each deploy installs a new worker that saves that
 * deploy's files. Saved Quran data and audio outlive deploys: their cache names change only by hand.
 */
const VERSION = 'dev';
const PRECACHE = [];
const SHELL = `shell-${VERSION}`;
const DATA = 'data-v1';
const AUDIO = 'audio-v1';
const BASE = new URL('./', self.location).pathname; // "/Quran/" on GitHub Pages

const AUDIO_HOSTS = ['verses.quran.com', 'the-quran-project.github.io', 'everyayah.com', 'audio.qurancdn.com'];
const DATA_HOSTS = ['api.quran.com', 'quranapi.pages.dev', 'ummahapi.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const LIMITS = { [SHELL]: 150, [DATA]: 3000, [AUDIO]: 600 };

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) =>
        cache.addAll([BASE, `${BASE}manifest.webmanifest`, `${BASE}icons/icon-192.png`, ...PRECACHE.map((f) => BASE + f)])
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL, DATA, AUDIO]);
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/** Drops the oldest entries beyond the cache's limit. */
const trim = async (name) => {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const extra = keys.length - LIMITS[name];
  for (let i = 0; i < extra; i++) await cache.delete(keys[i]);
};

const put = async (name, request, response) => {
  if (!response || response.status !== 200 || response.type === 'opaque') return;
  const cache = await caches.open(name);
  await cache.put(request, response);
  trim(name);
};

const networkFirst = async (request, cacheKey) => {
  try {
    const response = await fetch(request);
    put(SHELL, cacheKey, response.clone());
    return response;
  } catch (err) {
    const cached = await caches.match(cacheKey);
    if (cached) return cached;
    throw err;
  }
};

const cacheFirst = async (name, request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  put(name, request, response.clone());
  return response;
};

const staleWhileRevalidate = async (name, request, event) => {
  const cached = await caches.match(request);
  const refresh = fetch(request).then((response) => {
    put(name, request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch(() => undefined));
    return cached;
  }
  return refresh;
};

/** A slice of a saved recording, as a media player's Range request expects. */
const rangeOf = async (response, range) => {
  const body = await response.arrayBuffer();
  const [, from, to] = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = from ? Number(from) : 0;
  const end = Math.min(to ? Number(to) : body.byteLength - 1, body.byteLength - 1);
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${body.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
};

const audio = async (request) => {
  const key = request.url;
  let whole = await caches.match(key);
  if (!whole) {
    try {
      // The whole file, without the player's Range header, so it can be saved and replayed offline
      whole = await fetch(key, { mode: 'cors', credentials: 'omit' });
    } catch {
      return fetch(request);
    }
    if (whole.status !== 200) return whole;
    await put(AUDIO, key, whole.clone());
  }
  const range = request.headers.get('range');
  return range ? rangeOf(whole, range) : whole;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(networkFirst(request, BASE));
  } else if (url.origin === self.location.origin && url.pathname.startsWith(`${BASE}assets/`)) {
    event.respondWith(cacheFirst(SHELL, request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(DATA, request, event));
  } else if (AUDIO_HOSTS.includes(url.hostname) && url.pathname.endsWith('.mp3')) {
    event.respondWith(audio(request));
  } else if (DATA_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(DATA, request, event));
  }
});
