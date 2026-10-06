import { getDb } from './neonService.js';

const SESSION_KEY = 'devops_admin_session';
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

// --- Crypto helpers using standard Web Crypto API (Browser & Node native) ---

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const exported = await crypto.subtle.exportKey('raw', key);
  return Array.from(new Uint8Array(exported))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Local listeners for authentication state changes
const authListeners = new Set();

function notifyAuthListeners(user) {
  authListeners.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Check session expiry
    if (user && user.loggedInAt) {
      const elapsed = Date.now() - user.loggedInAt;
      if (elapsed > SESSION_TTL_MS) {
        // Session expired — clear it
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }
    return user;
  } catch {
    return null;
  }
}

export function onAdminAuthStateChanged(callback) {
  authListeners.add(callback);
  // Immediately call with current state
  const currentUser = getCurrentUser();
  callback(currentUser);

  // Cross-tab sync
  const storageHandler = (e) => {
    if (e.key === SESSION_KEY) {
      callback(getCurrentUser());
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', storageHandler);
  }

  // Periodic session-expiry heartbeat (checks every 60s)
  let expiryInterval = null;
  if (typeof window !== 'undefined') {
    expiryInterval = setInterval(() => {
      const user = getCurrentUser(); // returns null if expired
      callback(user);
    }, 60_000);
  }

  return () => {
    authListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', storageHandler);
    }
    if (expiryInterval) clearInterval(expiryInterval);
  };
}

export async function adminSignIn(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const sql = getDb();

  const users = await sql`
    SELECT * FROM admin_users 
    WHERE LOWER(email) = ${cleanEmail} 
    LIMIT 1;
  `;

  if (users.length === 0) {
    throw new Error('Invalid credentials or user not found.');
  }

  const user = users[0];
  let isMatch = false;

  // 1. Check PBKDF2 hash match if salt is present
  if (user.salt) {
    try {
      const computedHash = await hashPassword(password, user.salt);
      if (computedHash === user.password_hash) {
        isMatch = true;
      }
    } catch (err) {
      console.warn('Hash computation failed:', err);
    }
  }

  // 2. Check plaintext match (for records inserted manually via Neon Console)
  if (!isMatch && user.password_hash === password) {
    isMatch = true;
    // Auto-upgrade password to secure PBKDF2 hash with fresh cryptographic salt
    try {
      const newSalt = generateSalt();
      const newHash = await hashPassword(password, newSalt);
      await sql`
        UPDATE admin_users 
        SET password_hash = ${newHash}, salt = ${newSalt}
        WHERE id = ${user.id};
      `;
      console.log(`Successfully upgraded password hash for ${user.email}`);
    } catch (upgradeErr) {
      console.warn('Could not auto-upgrade password hash:', upgradeErr);
    }
  }

  if (!isMatch) {
    throw new Error('Invalid credentials or incorrect password.');
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    role: user.role || 'admin',
    loggedInAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  }
  notifyAuthListeners(sessionUser);

  return sessionUser;
}

export async function adminSignOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
  notifyAuthListeners(null);
}

export async function adminChangePassword(email, currentPassword, newPassword) {
  if (!email || !currentPassword || !newPassword) {
    throw new Error('All fields are required to change password.');
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const sql = getDb();

  const users = await sql`
    SELECT * FROM admin_users 
    WHERE LOWER(email) = ${cleanEmail} 
    LIMIT 1;
  `;

  if (users.length === 0) {
    throw new Error('User not found.');
  }

  const user = users[0];
  let isCurrentValid = false;

  if (user.salt) {
    const currentHash = await hashPassword(currentPassword, user.salt);
    if (currentHash === user.password_hash) isCurrentValid = true;
  }
  if (!isCurrentValid && user.password_hash === currentPassword) {
    isCurrentValid = true;
  }

  if (!isCurrentValid) {
    throw new Error('Current password is incorrect.');
  }

  const newSalt = generateSalt();
  const newHash = await hashPassword(newPassword, newSalt);

  await sql`
    UPDATE admin_users 
    SET password_hash = ${newHash}, salt = ${newSalt}
    WHERE id = ${user.id};
  `;

  return true;
}

export async function getAdminUsers() {
  const sql = getDb();
  const rows = await sql`
    SELECT id, email, role, created_at 
    FROM admin_users 
    ORDER BY created_at ASC;
  `;
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    role: r.role || 'admin',
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
  }));
}

export async function createAdminUser(email, password, role = 'admin') {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const sql = getDb();

  const existing = await sql`
    SELECT id FROM admin_users WHERE LOWER(email) = ${cleanEmail};
  `;
  if (existing.length > 0) {
    throw new Error('An admin user with this email already exists.');
  }

  const salt = generateSalt();
  const hash = await hashPassword(password, salt);

  const res = await sql`
    INSERT INTO admin_users (email, password_hash, salt, role)
    VALUES (${cleanEmail}, ${hash}, ${salt}, ${role})
    RETURNING id, email, role, created_at;
  `;

  return {
    id: res[0].id,
    email: res[0].email,
    role: res[0].role,
    createdAt: res[0].created_at ? new Date(res[0].created_at) : new Date(),
  };
}

export async function deleteAdminUser(id, currentUserId) {
  if (!id) throw new Error('User ID is required.');
  if (id === currentUserId) {
    throw new Error('You cannot delete your own logged-in admin account.');
  }

  const sql = getDb();
  const countRes = await sql`SELECT count(*) FROM admin_users;`;
  const count = parseInt(countRes[0]?.count || '0', 10);
  if (count <= 1) {
    throw new Error('Cannot delete the last remaining admin account.');
  }

  await sql`DELETE FROM admin_users WHERE id = ${id};`;
  return true;
}
