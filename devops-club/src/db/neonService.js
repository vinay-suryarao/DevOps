import { neon } from '@neondatabase/serverless';

// Retrieve database URL from environment variables (.env)
const databaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
  '';

let sqlClient = null;

export function getDb() {
  if (!databaseUrl) {
    console.error('Missing VITE_DATABASE_URL or DATABASE_URL. Please define it in your .env file.');
  }
  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }
  return sqlClient;
}

// Simple event-listener hub so mutations immediately update active listeners
const listeners = {
  events: new Set(),
  hackathons: new Set(),
  announcements: new Set(),
  registrations: new Set(),
};

function notifyListeners(section) {
  if (listeners[section]) {
    listeners[section].forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error(`Error in listener for ${section}:`, err);
      }
    });
  }
}

// --- Data Mappers ---
function mapRegistration(row) {
  if (!row) return null;
  return {
    id: row.id,
    eventId: row.event_id || '',
    eventName: row.event_name || '',
    fullName: row.full_name || '',
    email: row.email || '',
    phone: row.phone || '',
    moodleId: row.moodle_id || '',
    semester: row.semester || '',
    branch: row.branch || '',
    division: row.division || '',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}
function mapEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    date: row.date || '',
    time: row.time || '',
    location: row.location || '',
    mode: row.mode || 'Offline',
    type: row.type || 'upcoming',
    speaker: row.speaker || row.speakers || '',
    speakers: row.speakers || row.speaker || '',
    brief: row.brief || '',
    reportUrl: row.report_url || '',
    posterUrl: row.poster_url || '',
    cardImageUrl: row.card_image_url || '',
    galleryImages: Array.isArray(row.gallery_images)
      ? row.gallery_images
      : typeof row.gallery_images === 'string'
      ? JSON.parse(row.gallery_images || '[]')
      : [],
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

function mapHackathon(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    description: row.description || '',
    date: row.date || '',
    teamSize: row.team_size ?? 4,
    isEnabled: row.is_enabled ?? true,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

function mapAnnouncement(row) {
  if (!row) return null;
  const createdDate = row.created_at ? new Date(row.created_at) : new Date();
  const seconds = Math.floor(createdDate.getTime() / 1000);
  return {
    id: row.id,
    title: row.title || '',
    content: row.content || '',
    created_at: row.created_at,
    // Compatible with Newsletters.jsx which accesses createdAt.seconds
    createdAt: {
      seconds,
      toDate: () => createdDate,
    },
  };
}

// ==========================================
// EVENTS API
// ==========================================

export async function getEvents() {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM events 
    ORDER BY date DESC, created_at DESC;
  `;
  return rows.map(mapEvent);
}

// Ultra-lightweight listing for Admin dashboard — excludes ALL image columns (poster, card, gallery)
// Reduces payload from megabytes to bytes and executes in ~15ms
export async function getEventsAdminListing() {
  const sql = getDb();
  const rows = await sql`
    SELECT id, name, date, time, location, mode, type,
           speaker, speakers, brief, report_url, created_at
    FROM events 
    ORDER BY date DESC, created_at DESC;
  `;
  return rows.map(mapEvent);
}

import { idbGet, idbSet, idbDelete, idbClear } from './indexedDbCache.js';

// In-memory cache for events listing and individual event details
let eventsListingCache = null;
let eventsListingCacheTime = 0;
let eventsListingInFlight = null;
const EVENTS_CACHE_TTL = 60 * 1000;
const eventDetailCache = new Map();
const eventDetailInFlight = new Map();

// On module load in browser, pre-populate in-memory cache from persistent IndexedDB
if (typeof window !== 'undefined') {
  idbGet('events_listing').then((cached) => {
    if (cached && Array.isArray(cached) && cached.length > 0 && !eventsListingCache) {
      eventsListingCache = cached;
      eventsListingCacheTime = Date.now();
    }
  }).catch(() => {});
}

export function invalidateEventsCache() {
  eventsListingCache = null;
  eventsListingCacheTime = 0;
  eventsListingInFlight = null;
  eventDetailCache.clear();
  eventDetailInFlight.clear();
  idbClear().catch(() => {});
}

// Synchronous getter — returns cached events immediately (null if not cached yet)
export function getCachedEventsListing() {
  const now = Date.now();
  if (eventsListingCache && (now - eventsListingCacheTime < EVENTS_CACHE_TTL)) {
    return eventsListingCache;
  }
  return eventsListingCache || null;
}

// Lightweight listing — excludes heavy gallery_images and unnecessary images per type (600KB vs 3MB+)
export async function getEventsListing(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && eventsListingCache && (now - eventsListingCacheTime < EVENTS_CACHE_TTL)) {
    return eventsListingCache;
  }

  // Check persistent IndexedDB cache before hitting network
  if (!forceRefresh && !eventsListingCache) {
    const fromIdb = await idbGet('events_listing');
    if (fromIdb && Array.isArray(fromIdb) && fromIdb.length > 0) {
      eventsListingCache = fromIdb;
      eventsListingCacheTime = now;
      // Revalidate in background without blocking caller
      setTimeout(() => {
        getEventsListing(true).catch(() => {});
      }, 500);
      return fromIdb;
    }
  }

  // Deduplicate concurrent requests
  if (eventsListingInFlight) {
    return eventsListingInFlight;
  }

  eventsListingInFlight = (async () => {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT id, name, date, time, location, mode, type,
               speaker, speakers, brief, report_url,
               CASE WHEN type = 'upcoming' THEN poster_url ELSE '' END AS poster_url,
               CASE WHEN type = 'past' THEN card_image_url ELSE '' END AS card_image_url,
               created_at
        FROM events 
        ORDER BY date DESC, created_at DESC;
      `;
      const mapped = rows.map(mapEvent);
      eventsListingCache = mapped;
      eventsListingCacheTime = Date.now();
      idbSet('events_listing', mapped).catch(() => {});
      return mapped;
    } finally {
      eventsListingInFlight = null;
    }
  })();

  return eventsListingInFlight;
}

// Full detail for a single event (includes all images and gallery) with in-memory & IndexedDB caching
export async function getEventById(id, forceRefresh = false) {
  if (!id) return null;
  if (!forceRefresh && eventDetailCache.has(id)) {
    return eventDetailCache.get(id);
  }

  if (!forceRefresh) {
    const fromIdb = await idbGet(`event_detail_${id}`);
    if (fromIdb) {
      eventDetailCache.set(id, fromIdb);
      return fromIdb;
    }
  }

  if (eventDetailInFlight.has(id)) {
    return eventDetailInFlight.get(id);
  }

  const promise = (async () => {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT * FROM events WHERE id = ${id} LIMIT 1;
      `;
      const event = rows.length > 0 ? mapEvent(rows[0]) : null;
      if (event) {
        eventDetailCache.set(id, event);
        idbSet(`event_detail_${id}`, event).catch(() => {});
      }
      return event;
    } finally {
      eventDetailInFlight.delete(id);
    }
  })();

  eventDetailInFlight.set(id, promise);
  return promise;
}

export async function createEvent(data) {
  const sql = getDb();
  const galleryJson = JSON.stringify(data.galleryImages || []);
  const rows = await sql`
    INSERT INTO events (
      name, date, time, location, mode, type, 
      speaker, speakers, brief, report_url, 
      poster_url, card_image_url, gallery_images
    )
    VALUES (
      ${data.name || ''},
      ${data.date || ''},
      ${data.time || ''},
      ${data.location || ''},
      ${data.mode || 'Offline'},
      ${data.type || 'upcoming'},
      ${data.speaker || data.speakers || ''},
      ${data.speakers || data.speaker || ''},
      ${data.brief || ''},
      ${data.reportUrl || ''},
      ${data.posterUrl || ''},
      ${data.cardImageUrl || ''},
      ${galleryJson}::jsonb
    )
    RETURNING *;
  `;
  invalidateEventsCache();
  notifyListeners('events');
  return mapEvent(rows[0]);
}

export async function updateEvent(id, data) {
  const sql = getDb();
  const hasGallery = data.galleryImages !== undefined && Array.isArray(data.galleryImages);
  const galleryJson = hasGallery ? JSON.stringify(data.galleryImages) : null;

  const rows = await sql`
    UPDATE events
    SET 
      name = ${data.name || ''},
      date = ${data.date || ''},
      time = ${data.time || ''},
      location = ${data.location || ''},
      mode = ${data.mode || 'Offline'},
      type = ${data.type || 'upcoming'},
      speaker = ${data.speaker || data.speakers || ''},
      speakers = ${data.speakers || data.speaker || ''},
      brief = ${data.brief || ''},
      report_url = ${data.reportUrl || ''},
      poster_url = CASE WHEN ${data.posterUrl !== undefined && data.posterUrl !== ''} THEN ${data.posterUrl} ELSE poster_url END,
      card_image_url = CASE WHEN ${data.cardImageUrl !== undefined && data.cardImageUrl !== ''} THEN ${data.cardImageUrl} ELSE card_image_url END,
      gallery_images = CASE WHEN ${hasGallery} THEN ${galleryJson}::jsonb ELSE gallery_images END
    WHERE id = ${id}
    RETURNING *;
  `;
  invalidateEventsCache();
  notifyListeners('events');
  return mapEvent(rows[0]);
}

export async function deleteEvent(id) {
  const sql = getDb();
  await sql`DELETE FROM events WHERE id = ${id}`;
  invalidateEventsCache();
  notifyListeners('events');
}

export function subscribeEvents(callback, onError) {
  let active = true;
  const fetchAndNotify = async () => {
    try {
      const data = await getEventsAdminListing();
      if (active) callback(data);
    } catch (err) {
      if (active && onError) onError(err);
      console.error('Error fetching events:', err);
    }
  };

  fetchAndNotify();
  const refreshHandler = () => fetchAndNotify();
  listeners.events.add(refreshHandler);

  // Poll every 30 seconds for remote changes
  const interval = setInterval(fetchAndNotify, 30000);

  return () => {
    active = false;
    clearInterval(interval);
    listeners.events.delete(refreshHandler);
  };
}

// ==========================================
// HACKATHONS API
// ==========================================

export async function getHackathons(onlyEnabled = false) {
  const sql = getDb();
  let rows;
  if (onlyEnabled) {
    rows = await sql`
      SELECT * FROM hackathons 
      WHERE is_enabled = true 
      ORDER BY created_at DESC;
    `;
  } else {
    rows = await sql`
      SELECT * FROM hackathons 
      ORDER BY created_at DESC;
    `;
  }
  return rows.map(mapHackathon);
}

export async function createHackathon(data) {
  const sql = getDb();
  const teamSize = parseInt(data.teamSize, 10) || 4;
  const isEnabled = data.isEnabled !== undefined ? Boolean(data.isEnabled) : true;
  const rows = await sql`
    INSERT INTO hackathons (
      name, description, date, team_size, is_enabled
    )
    VALUES (
      ${data.name || data.title || ''},
      ${data.description || data.content || ''},
      ${data.date || ''},
      ${teamSize},
      ${isEnabled}
    )
    RETURNING *;
  `;
  notifyListeners('hackathons');
  return mapHackathon(rows[0]);
}

export async function updateHackathon(id, data) {
  const sql = getDb();
  const teamSize = parseInt(data.teamSize, 10) || 4;
  const rows = await sql`
    UPDATE hackathons
    SET 
      name = ${data.name || data.title || ''},
      description = ${data.description || data.content || ''},
      date = ${data.date || ''},
      team_size = ${teamSize}
    WHERE id = ${id}
    RETURNING *;
  `;
  notifyListeners('hackathons');
  return mapHackathon(rows[0]);
}

export async function toggleHackathonStatus(id, currentStatus) {
  const sql = getDb();
  const newStatus = !currentStatus;
  const rows = await sql`
    UPDATE hackathons
    SET is_enabled = ${newStatus}
    WHERE id = ${id}
    RETURNING *;
  `;
  notifyListeners('hackathons');
  return mapHackathon(rows[0]);
}

export async function deleteHackathon(id) {
  const sql = getDb();
  await sql`DELETE FROM hackathons WHERE id = ${id}`;
  notifyListeners('hackathons');
}

export function subscribeHackathons(callback, onError, onlyEnabled = false) {
  let active = true;
  const fetchAndNotify = async () => {
    try {
      const data = await getHackathons(onlyEnabled);
      if (active) callback(data);
    } catch (err) {
      if (active && onError) onError(err);
      console.error('Error fetching hackathons:', err);
    }
  };

  fetchAndNotify();
  const refreshHandler = () => fetchAndNotify();
  listeners.hackathons.add(refreshHandler);

  const interval = setInterval(fetchAndNotify, 10000);

  return () => {
    active = false;
    clearInterval(interval);
    listeners.hackathons.delete(refreshHandler);
  };
}

// ==========================================
// ANNOUNCEMENTS API
// ==========================================

export async function getAnnouncements() {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM announcements 
    ORDER BY created_at DESC;
  `;
  return rows.map(mapAnnouncement);
}

export async function createAnnouncement(data) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO announcements (
      title, content
    )
    VALUES (
      ${data.title || data.name || ''},
      ${data.content || data.description || ''}
    )
    RETURNING *;
  `;
  notifyListeners('announcements');
  return mapAnnouncement(rows[0]);
}

export async function updateAnnouncement(id, data) {
  const sql = getDb();
  const rows = await sql`
    UPDATE announcements
    SET 
      title = ${data.title || data.name || ''},
      content = ${data.content || data.description || ''}
    WHERE id = ${id}
    RETURNING *;
  `;
  notifyListeners('announcements');
  return mapAnnouncement(rows[0]);
}

export async function deleteAnnouncement(id) {
  const sql = getDb();
  await sql`DELETE FROM announcements WHERE id = ${id}`;
  notifyListeners('announcements');
}

export function subscribeAnnouncements(callback, onError) {
  let active = true;
  const fetchAndNotify = async () => {
    try {
      const data = await getAnnouncements();
      if (active) callback(data);
    } catch (err) {
      if (active && onError) onError(err);
      console.error('Error fetching announcements:', err);
    }
  };

  fetchAndNotify();
  const refreshHandler = () => fetchAndNotify();
  listeners.announcements.add(refreshHandler);

  const interval = setInterval(fetchAndNotify, 30000);

  return () => {
    active = false;
    clearInterval(interval);
    listeners.announcements.delete(refreshHandler);
  };
}

// ==========================================
// REGISTRATIONS API
// ==========================================

export async function registerForEvent(data) {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO event_registrations (
      event_id, event_name, full_name, email, phone, moodle_id, semester, branch, division
    )
    VALUES (
      ${data.eventId || ''},
      ${data.eventName || data.Event || ''},
      ${data.fullName || data.FullName || ''},
      ${data.email || data.Email || ''},
      ${data.phone || data.Phone || ''},
      ${data.moodleId || data.MoodleID || ''},
      ${data.semester || data.Semester || ''},
      ${data.branch || data.Branch || ''},
      ${data.division || data.Division || ''}
    )
    RETURNING *;
  `;
  notifyListeners('registrations');
  return mapRegistration(rows[0]);
}

export async function getEventRegistrations(eventId = null) {
  const sql = getDb();
  let rows;
  if (eventId && eventId !== 'all') {
    rows = await sql`
      SELECT * FROM event_registrations 
      WHERE event_id = ${eventId} OR event_name = ${eventId}
      ORDER BY created_at DESC;
    `;
  } else {
    rows = await sql`
      SELECT * FROM event_registrations 
      ORDER BY created_at DESC;
    `;
  }
  return rows.map(mapRegistration);
}

export async function deleteEventRegistration(id) {
  const sql = getDb();
  await sql`DELETE FROM event_registrations WHERE id = ${id}`;
  notifyListeners('registrations');
}

export function subscribeEventRegistrations(callback, onError, eventId = null) {
  let active = true;
  const fetchAndNotify = async () => {
    try {
      const data = await getEventRegistrations(eventId);
      if (active) callback(data);
    } catch (err) {
      if (active && onError) onError(err);
      console.error('Error fetching registrations:', err);
    }
  };

  fetchAndNotify();
  const refreshHandler = () => fetchAndNotify();
  listeners.registrations.add(refreshHandler);

  const interval = setInterval(fetchAndNotify, 30000);

  return () => {
    active = false;
    clearInterval(interval);
    listeners.registrations.delete(refreshHandler);
  };
}

// ==========================================
// IMAGES API (Direct Neon DB Storage)
// ==========================================

export async function fileToDataUrl(file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      if (typeof window === 'undefined' || typeof Image === 'undefined') {
        return resolve(reader.result);
      }

      const img = new Image();
      img.onerror = () => {
        // Image couldn't be decoded (e.g. HEIC on non-Safari) — skip it
        console.warn('Image could not be decoded by browser:', file.name);
        resolve(null);
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Always output as image/jpeg with 0.8 quality to prevent massive uncompressed payloads
        resolve(canvas.toDataURL('image/jpeg', quality || 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToNeon(file) {
  if (!file) return null;
  const dataUrl = await fileToDataUrl(file);
  if (!dataUrl) return null;

  try {
    const sql = getDb();
    await sql`
      INSERT INTO images (name, mime_type, data)
      VALUES (${file.name || 'uploaded_image'}, ${file.type || 'image/jpeg'}, ${dataUrl})
      RETURNING id;
    `;
  } catch (err) {
    console.warn('Could not insert image into images backup table (dataUrl still valid):', err);
  }

  return dataUrl;
}

