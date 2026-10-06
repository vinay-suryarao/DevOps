import fs from 'fs';
import path from 'path';

// Read connection string from process.env or local .env file
let connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
  try {
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), 'devops-club', '.env'),
      path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../../.env')
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/) || content.match(/VITE_DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match) {
          connectionString = match[1];
          break;
        }
      }
    }
  } catch {
    // continue
  }
}

if (!connectionString) {
  console.error('Error: DATABASE_URL is not set. Please set it in your environment or .env file before running migration.');
  process.exit(1);
}

const sql = neon(connectionString);

async function run() {
  console.log('Testing connection to Neon DB...');
  const res = await sql`SELECT version()`;
  console.log('Connected successfully! Version:', res[0].version);

  console.log('Creating tables if they do not exist...');

  // Events table
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      date TEXT,
      time TEXT,
      location TEXT,
      mode TEXT DEFAULT 'Offline',
      type TEXT DEFAULT 'upcoming',
      speaker TEXT,
      speakers TEXT,
      brief TEXT,
      report_url TEXT,
      poster_url TEXT,
      card_image_url TEXT,
      gallery_images JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Hackathons table
  await sql`
    CREATE TABLE IF NOT EXISTS hackathons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      date TEXT,
      team_size INTEGER DEFAULT 4,
      is_enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Announcements table
  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Images table (to store uploaded images directly in Neon)
  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      mime_type TEXT,
      data TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Admin users table
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Event registrations table
  await sql`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id TEXT,
      event_name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      moodle_id TEXT NOT NULL,
      semester TEXT,
      branch TEXT,
      division TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Seed default admin if none exists
  const existingAdmins = await sql`SELECT count(*) FROM admin_users;`;
  if (parseInt(existingAdmins[0].count, 10) === 0) {
    const defaultEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const defaultPassword = process.env.ADMIN_PASSWORD;

    if (!defaultEmail || !defaultPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file to seed the default admin.');
      process.exit(1);
    }

    // Hash password with Web Crypto PBKDF2
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(defaultPassword),
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
    const passwordHash = Array.from(new Uint8Array(exported))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    await sql`
      INSERT INTO admin_users (email, password_hash, salt, role)
      VALUES (${defaultEmail}, ${passwordHash}, ${salt}, 'admin');
    `;
    console.log(`Default admin user seeded: ${defaultEmail}`);
  }

  console.log('Tables created or already exist!');

  const tables = await sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
  `;
  console.log('Public tables in Neon DB:', tables.map(t => t.table_name));
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
