// Simple, robust client-side persistent cache using IndexedDB
// Keeps events and images instantly accessible across tabs, reloads, and sessions (0ms load time)

const DB_NAME = 'apsit_devops_cache_v2';
const STORE_NAME = 'keyval_store';
const DB_VERSION = 1;

let dbPromise = null;

function getDbInstance() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => {
          console.warn('IndexedDB open error:', e);
          resolve(null);
        };
        req.onblocked = () => resolve(null);
      } catch (err) {
        console.warn('IndexedDB init failed:', err);
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function idbGet(key) {
  try {
    const db = await getDbInstance();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function idbSet(key, value) {
  try {
    const db = await getDbInstance();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
  } catch {
    // Fail silently without disrupting user experience
  }
}

export async function idbDelete(key) {
  try {
    const db = await getDbInstance();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
  } catch {
    // Fail silently
  }
}

export async function idbClear() {
  try {
    const db = await getDbInstance();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
  } catch {
    // Fail silently
  }
}
