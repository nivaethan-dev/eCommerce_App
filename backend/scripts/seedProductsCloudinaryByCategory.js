/**
 * Seed Products (per-category) with locally generated images uploaded to Cloudinary
 *
 * Why this exists:
 * - You want Cloudinary to host images, but you do NOT want external image sources (e.g. picsum URLs).
 * - You also want to keep your existing validations: multer mimetype filter, file-type sniffing,
 *   sharp resize, and Cloudinary upload in `productUploadBundle`.
 * - This script creates products ONLY via `POST /api/products/create` so nothing is bypassed.
 *
 * Usage:
 *   SEED_ADMIN_EMAIL="admin@example.com" SEED_ADMIN_PASSWORD="..." \
 *   node scripts/seedProductsCloudinaryByCategory.js --category=Electronics
 *
 * Flags:
 *   --category=Electronics     (required)
 *   --count=20                (default 20)
 *   --base-url=http://localhost:3000  (default)
 *   --image-dir=./seed_images (optional; uses real product photos from disk, per category)
 *   --download-images         (optional; auto-download category images into --asset-dir and reuse)
 *   --asset-dir=./seed_assets (default ./seed_assets; cache of downloaded images, per category)
 *   --seed-tag=1736700000000  (optional; makes it easier to rollback a run)
 *   --yes                     (skip the confirmation prompt)
 *   --dry-run                 (no API calls, prints what would be created)
 */

import readline from 'node:readline/promises';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');

const VALID_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys'
];

const CATEGORY_STYLES = {
  Electronics: { bg: '#1e3a8a', fg: '#ffffff', accent: '#60a5fa', icon: '⚡' },
  Clothing: { bg: '#7c2d12', fg: '#ffffff', accent: '#fdba74', icon: '👕' },
  Books: { bg: '#14532d', fg: '#ffffff', accent: '#86efac', icon: '📚' },
  'Home & Kitchen': { bg: '#3f1d56', fg: '#ffffff', accent: '#d8b4fe', icon: '🏠' },
  Sports: { bg: '#064e3b', fg: '#ffffff', accent: '#34d399', icon: '🏀' },
  Toys: { bg: '#7f1d1d', fg: '#ffffff', accent: '#fca5a5', icon: '🧸' }
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const getValue = (prefix, fallback = undefined) => {
    const found = args.find((a) => a.startsWith(prefix));
    if (!found) return fallback;
    const [, value] = found.split('=');
    return value ?? fallback;
  };
  const hasFlag = (flag) => args.includes(flag);

  return {
    category: getValue('--category', ''),
    count: Number(getValue('--count', '20')) || 20,
    baseUrl: getValue('--base-url', 'http://localhost:3000'),
    dryRun: hasFlag('--dry-run'),
    envFile: getValue('--env-file', path.join(backendDir, '.env')),
    imageDir: getValue('--image-dir', ''),
    assetDir: getValue('--asset-dir', path.join(backendDir, 'seed_assets')),
    downloadImages: hasFlag('--download-images'),
    yes: hasFlag('--yes'),
    seedTag: getValue('--seed-tag', '')
  };
}

function isValidCategory(category) {
  return VALID_CATEGORIES.includes(category);
}

function randomSuffix(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function slugifyCategory(category) {
  return String(category)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pickDeterministic(list, i, salt = 0) {
  if (!list || list.length === 0) return undefined;
  const idx = (i + salt) % list.length;
  return list[idx];
}

function buildRealisticSeedProduct({ category, index, seedTag }) {
  const suffix = randomSuffix(5);
  const tagShort = String(seedTag).slice(-6);

  const catalog = {
    Electronics: {
      types: [
        'Wireless Headphones',
        'Bluetooth Speaker',
        'Smart Watch',
        'Mechanical Keyboard',
        'Gaming Mouse',
        '4K Monitor',
        'USB-C Hub',
        'Portable SSD',
        'Power Bank',
        'HD Webcam'
      ],
      brands: ['Aether', 'Nova', 'Vertex', 'Pulse', 'Orbit', 'Zenith', 'Lumen'],
      features: [
        'low-latency audio',
        'fast charging',
        'noise cancellation',
        'Bluetooth 5.3',
        'USB-C PD support',
        'high refresh rate',
        'compact design'
      ],
      priceBase: 39.99,
      priceStep: 12.5
    },
    Clothing: {
      types: ['Cotton T-Shirt', 'Denim Jacket', 'Hoodie', 'Athletic Shorts', 'Sneakers', 'Polo Shirt'],
      brands: ['Threadline', 'UrbanWeave', 'NordicFit', 'Coast', 'Cedar', 'Atlas'],
      features: ['breathable fabric', 'soft touch', 'durable stitching', 'classic fit', 'easy-care'],
      priceBase: 14.99,
      priceStep: 7.75
    },
    Books: {
      types: ['Mystery Novel', 'Fantasy Epic', 'Self-Help Guide', 'Cookbook', 'Tech Handbook', 'Biography'],
      brands: ['PaperTrail Press', 'SilverLeaf', 'Cobalt House', 'Northwind Editions'],
      features: ['engaging storytelling', 'practical tips', 'illustrated chapters', 'easy-to-follow examples'],
      priceBase: 9.99,
      priceStep: 4.25
    },
    'Home & Kitchen': {
      types: ['Non-stick Frying Pan', 'Chef Knife', 'Air Fryer Basket', 'Storage Container Set', 'Coffee Grinder'],
      brands: ['Hearth & Home', 'KitchenCraft', 'EverPan', 'BrewCo', 'Stoneware'],
      features: ['easy to clean', 'heat resistant', 'space-saving', 'everyday essential', 'durable build'],
      priceBase: 12.99,
      priceStep: 9.5
    },
    Sports: {
      types: ['Fitness Tracker', 'Yoga Mat', 'Dumbbell Set', 'Running Shoes', 'Sports Bottle', 'Resistance Bands'],
      brands: ['Stride', 'Peak', 'Enduro', 'FlexPro', 'Summit'],
      features: ['sweat-resistant', 'high grip', 'lightweight', 'ergonomic', 'built for training'],
      priceBase: 11.99,
      priceStep: 8.25
    },
    Toys: {
      types: ['Building Blocks Set', 'RC Car', 'Plush Toy', 'Puzzle Box', 'Art Kit', 'Board Game'],
      brands: ['Playforge', 'BrightBox', 'TinyTown', 'WonderWorks'],
      features: ['kid-friendly', 'durable materials', 'hours of fun', 'great gift', 'easy to learn'],
      priceBase: 8.99,
      priceStep: 6.5
    }
  };

  const cat = catalog[category] || catalog.Electronics;
  const type = pickDeterministic(cat.types, index, 1);
  const brand = pickDeterministic(cat.brands, index, 2);
  const f1 = pickDeterministic(cat.features, index, 3);
  const f2 = pickDeterministic(cat.features, index, 5);

  const title = `${brand} ${type} (${category}) ${tagShort}-${String(index).padStart(2, '0')}-${suffix}`;
  const description = `${brand} ${type} designed for ${category.toLowerCase()} use. Features: ${f1}, ${f2}. Seeded product (validated upload → Cloudinary).`;
  const stock = 5 + ((index * 7) % 60);
  const price = Number((cat.priceBase + index * cat.priceStep).toFixed(2));

  return { title, description, stock, category, price };
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function makeOverlaySvg({ width, height, category, productIndex }) {
  const style = CATEGORY_STYLES[category] || { fg: '#ffffff', accent: '#ffffff', icon: '' };
  const title = `${category} Product ${String(productIndex).padStart(2, '0')}`;
  const subtitle = `Seeded image • ${new Date().toISOString().slice(0, 10)}`;
  const icon = style.icon || '';

  // Use system-safe fonts; Cloudinary will host the final image.
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${style.accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${style.accent}" stop-opacity="0.00"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="48" y="48" width="${width - 96}" height="${height - 96}" rx="28" fill="rgba(0,0,0,0.35)"/>
      <text x="96" y="165" font-family="Arial, sans-serif" font-size="84" fill="${style.fg}">${escapeXml(icon)} ${escapeXml(title)}</text>
      <text x="96" y="235" font-family="Arial, sans-serif" font-size="34" fill="${style.fg}" opacity="0.9">${escapeXml(subtitle)}</text>
      <text x="96" y="${height - 110}" font-family="Arial, sans-serif" font-size="28" fill="${style.fg}" opacity="0.85">800×600 enforced by backend Sharp pipeline</text>
    </svg>`,
    'utf-8'
  );
}

async function generateCategoryImagePng({ category, productIndex }) {
  const width = 1200;
  const height = 900;
  const style = CATEGORY_STYLES[category] || { bg: '#111827' };

  const base = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: style.bg
    }
  });

  const overlay = makeOverlaySvg({ width, height, category, productIndex });

  // Output PNG so multer fileFilter sees image/png and backend validateImage sees valid bytes.
  return await base
    .composite([{ input: overlay }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function extToMime(ext) {
  const e = String(ext).toLowerCase();
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg';
  if (e === '.png') return 'image/png';
  if (e === '.webp') return 'image/webp';
  if (e === '.avif') return 'image/avif';
  return '';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeWhitespace(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

async function fetchCommonsFilePages({ query, limit = 60 }) {
  // MediaWiki API: search File namespace (6) for candidate images.
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    list: 'search',
    srnamespace: '6',
    srlimit: String(limit),
    srsearch: query
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    method: 'GET',
    headers: { 'User-Agent': 'cloudcart-seeder/1.0 (local dev)' }
  });
  if (!res.ok) throw new Error(`Commons search failed: HTTP ${res.status}`);
  const json = await res.json();
  const results = json?.query?.search || [];
  return results.map((r) => ({ pageid: r.pageid, title: r.title }));
}

async function fetchCommonsImageInfo(pageids) {
  if (!pageids || pageids.length === 0) return [];

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    pageids: pageids.join('|')
  });

  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    method: 'GET',
    headers: { 'User-Agent': 'cloudcart-seeder/1.0 (local dev)' }
  });
  if (!res.ok) throw new Error(`Commons imageinfo failed: HTTP ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages || {};

  const out = [];
  for (const [pid, page] of Object.entries(pages)) {
    const info = page?.imageinfo?.[0];
    if (!info?.url) continue;
    out.push({
      pageid: pid,
      title: page?.title,
      url: info.url,
      mime: info.mime || ''
    });
  }
  return out;
}

function commonsSearchQueryForCategory(category) {
  switch (category) {
    case 'Electronics':
      return 'electronics device gadget product photo';
    case 'Clothing':
      return 'clothing apparel t-shirt hoodie jacket product photo';
    case 'Books':
      return 'book cover hardcover paperback product photo';
    case 'Home & Kitchen':
      return 'kitchen cookware utensil appliance product photo';
    case 'Sports':
      return 'sports equipment shoes ball product photo';
    case 'Toys':
      return 'toy figurine plush building blocks product photo';
    default:
      return `${category} product photo`;
  }
}

async function fetchWithRetry(url, init, { retries = 3, baseDelayMs = 400 } = {}) {
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || res.status === 503) {
        // Backoff for rate limiting / transient.
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  throw lastErr || new Error('fetch failed');
}

function urlLooksLikeAllowedImage(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    // Exclude svg/tiff and other uncommon formats for our backend filter.
    if (p.endsWith('.svg') || p.endsWith('.svgz') || p.endsWith('.tif') || p.endsWith('.tiff')) return false;
    return (
      p.endsWith('.jpg') ||
      p.endsWith('.jpeg') ||
      p.endsWith('.png') ||
      p.endsWith('.webp') ||
      p.endsWith('.avif')
    );
  } catch {
    return false;
  }
}

async function isAllowedImageBuffer(buf) {
  const ft = await fileTypeFromBuffer(buf).catch(() => null);
  const ext = ft?.ext?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext);
}

function commonsQueryVariants(category) {
  // Broad, simple queries to get enough real photos. We rely on byte-checking to filter.
  if (category === 'Electronics') {
    return [
      'smartphone product photo filetype:bitmap',
      'laptop computer product photo filetype:bitmap',
      'headphones product photo filetype:bitmap',
      'camera product photo filetype:bitmap',
      'electronics device product photo filetype:bitmap'
    ];
  }
  if (category === 'Home & Kitchen') {
    return [
      'kitchen appliance product photo filetype:bitmap',
      'cookware product photo filetype:bitmap',
      'kitchen utensil product photo filetype:bitmap'
    ];
  }
  if (category === 'Books') {
    return [
      'book cover photo filetype:bitmap',
      'paperback book cover photo filetype:bitmap',
      'hardcover book cover photo filetype:bitmap'
    ];
  }
  if (category === 'Clothing') {
    return [
      't-shirt product photo filetype:bitmap',
      'hoodie product photo filetype:bitmap',
      'jacket product photo filetype:bitmap'
    ];
  }
  if (category === 'Sports') {
    return [
      'sports shoes product photo filetype:bitmap',
      'football ball product photo filetype:bitmap',
      'basketball product photo filetype:bitmap',
      'tennis racket product photo filetype:bitmap'
    ];
  }
  if (category === 'Toys') {
    return [
      'toy product photo filetype:bitmap',
      'plush toy product photo filetype:bitmap',
      'building blocks product photo filetype:bitmap'
    ];
  }
  return [commonsSearchQueryForCategory(category)];
}

async function ensureDownloadedImages({ assetDir, category, count }) {
  const resolvedAssetDir = path.isAbsolute(assetDir) ? assetDir : path.join(backendDir, assetDir);
  const categoryFolder = path.join(resolvedAssetDir, slugifyCategory(category));
  await fs.mkdir(categoryFolder, { recursive: true });

  const { files: existingFiles } = await listImageFilesForCategory(resolvedAssetDir, category);
  if (existingFiles.length >= count) {
    return { categoryFolder, downloaded: 0, total: existingFiles.length };
  }

  const needed = count - existingFiles.length;
  console.log(`Need ${needed} more cached images for ${category}. Downloading from Wikimedia Commons...`);

  const seenUrls = new Set(existingFiles);
  let downloaded = 0;

  const queryList = commonsQueryVariants(category);
  for (const q of queryList) {
    if (existingFiles.length + downloaded >= count) break;

    const searchResults = await fetchCommonsFilePages({ query: q, limit: 200 });
    if (!searchResults.length) continue;
    const pageids = searchResults.map((r) => r.pageid);
    const infos = await fetchCommonsImageInfo(pageids);

    for (const item of infos) {
      if (existingFiles.length + downloaded >= count) break;
      if (!item?.url || !urlLooksLikeAllowedImage(item.url)) continue;

      // Download to a temp file first, then rename into place (avoid partial files on crash).
      const url = item.url;
      const ext = path.extname(new URL(url).pathname) || '';
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext.toLowerCase()) ? ext.toLowerCase() : '.jpg';

      const baseName = `commons_${String(item.pageid)}_${randomSuffix(6)}${safeExt}`;
      const finalPath = path.join(categoryFolder, baseName);
      const tmpPath = `${finalPath}.tmp`;

      if (seenUrls.has(url)) continue;
      seenUrls.add(url);

      try {
        const res = await fetchWithRetry(url, { method: 'GET', headers: { 'User-Agent': 'cloudcart-seeder/1.0 (local dev)' } });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        if (!buf || buf.length < 25_000) continue; // skip tiny/non-image
        if (!(await isAllowedImageBuffer(buf))) continue;

        await fs.writeFile(tmpPath, buf);
        await fs.rename(tmpPath, finalPath);
        downloaded++;

        // Be polite to Commons.
        await sleep(300);
      } catch {
        // Ensure tmp is cleaned up
        try { await fs.unlink(tmpPath); } catch {}
      }
    }
  }

  const { files: afterFiles } = await listImageFilesForCategory(resolvedAssetDir, category);
  if (afterFiles.length < count) {
    throw new Error(
      `Downloaded ${downloaded}, but still only have ${afterFiles.length}/${count} cached images for ${category} in ${categoryFolder}.`
    );
  }

  return { categoryFolder, downloaded, total: afterFiles.length };
}

async function listImageFilesForCategory(imageDir, category) {
  // Support either:
  // - imageDir/<category>/*.jpg|png|webp|avif
  // - imageDir/<slug(category)>/*.jpg|...
  const candidates = [
    path.join(imageDir, category),
    path.join(imageDir, slugifyCategory(category))
  ];

  let folder = null;
  for (const c of candidates) {
    try {
      const st = await fs.stat(c);
      if (st.isDirectory()) {
        folder = c;
        break;
      }
    } catch {
      // ignore
    }
  }

  if (!folder) {
    throw new Error(
      `No category folder found. Expected "${candidates[0]}" or "${candidates[1]}".`
    );
  }

  const entries = await fs.readdir(folder);
  const files = entries
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
    })
    .map((f) => path.join(folder, f));

  return { folder, files };
}

async function loginAndGetCookieHeader({ baseUrl, email, password }) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'manual'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}): ${text || res.statusText}`);
  }

  // Node (undici) provides getSetCookie() in modern versions; keep fallback.
  const setCookies = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);

  if (!setCookies || setCookies.length === 0) {
    throw new Error('Login succeeded but no Set-Cookie was returned (cannot authenticate create calls).');
  }

  // Keep only `name=value` parts.
  const cookieHeader = setCookies
    .map((c) => c.split(';')[0])
    .filter(Boolean)
    .join('; ');

  if (!cookieHeader) {
    throw new Error('Unable to construct Cookie header from Set-Cookie.');
  }

  return cookieHeader;
}

async function createProductViaApi({ baseUrl, cookieHeader, product, imageBuffer, filename, mimeType }) {
  const form = new FormData();
  form.append('title', product.title);
  form.append('description', product.description);
  form.append('price', String(product.price));
  form.append('stock', String(product.stock));
  form.append('category', product.category);

  const blob = new Blob([imageBuffer], { type: mimeType });
  form.append('image', blob, filename);

  const res = await fetch(`${baseUrl}/api/products/create`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader
      // NOTE: do NOT set Content-Type for FormData; fetch will set boundary automatically.
    },
    body: form
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (json && json.error && (json.error.message || json.error)) ||
      (json && json.message) ||
      `HTTP ${res.status}`;
    throw new Error(`Create failed: ${msg}`);
  }

  return json;
}

async function promptYesNo(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(question)).trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

async function main() {
  const {
    category,
    count,
    baseUrl,
    dryRun,
    envFile,
    imageDir,
    assetDir,
    downloadImages,
    yes,
    seedTag: seedTagArg
  } = parseArgs(process.argv);

  // Load env for standalone script runs (npm/node does not auto-load .env)
  dotenv.config({ path: envFile });

  if (!category) {
    console.error('Missing --category. Example: --category=Electronics');
    process.exitCode = 1;
    return;
  }
  if (!isValidCategory(category)) {
    console.error(`Invalid category "${category}". Allowed: ${VALID_CATEGORIES.join(', ')}`);
    process.exitCode = 1;
    return;
  }
  if (!Number.isFinite(count) || count <= 0) {
    console.error(`Invalid --count "${count}".`);
    process.exitCode = 1;
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!dryRun && (!email || !password)) {
    console.error('Missing SEED_ADMIN_EMAIL and/or SEED_ADMIN_PASSWORD env vars.');
    console.error(`Loaded env file: ${envFile}`);
    process.exitCode = 1;
    return;
  }

  const seedTag = seedTagArg || `${Date.now()}`;

  let imageFiles = null;
  let imageFolder = null;
  if (imageDir && downloadImages) {
    throw new Error('Use either --image-dir or --download-images, not both.');
  }

  if (downloadImages) {
    const { categoryFolder, downloaded, total } = await ensureDownloadedImages({
      assetDir,
      category,
      count
    });
    console.log(`Cached images ready: ${total} in ${categoryFolder} (downloaded this run: ${downloaded})`);

    const resolvedAsset = path.isAbsolute(assetDir) ? assetDir : path.join(backendDir, assetDir);
    const { folder, files } = await listImageFilesForCategory(resolvedAsset, category);
    imageFiles = files;
    imageFolder = folder;
  } else if (imageDir) {
    const resolved = path.isAbsolute(imageDir) ? imageDir : path.join(backendDir, imageDir);
    const { folder, files } = await listImageFilesForCategory(resolved, category);
    if (files.length < count) {
      throw new Error(`Not enough images in "${folder}". Need at least ${count}, found ${files.length}.`);
    }
    imageFiles = files;
    imageFolder = folder;
  }

  console.log('--- Seed Products (Cloudinary) ---');
  console.log('Category:', category);
  console.log('Count:', count);
  console.log('Base URL:', baseUrl);
  console.log('Dry run:', dryRun);
  console.log('Seed tag:', seedTag);
  console.log(
    'Image source:',
    imageFiles
      ? `local files (${imageFolder})`
      : downloadImages
        ? `downloaded cache (${normalizeWhitespace(String(assetDir))})`
        : 'locally generated (sharp)'
  );
  console.log('Image host: Cloudinary (via existing upload middleware)');

  const ok = yes ? true : await promptYesNo(`Proceed to create ${count} products for "${category}"? (y/N): `);
  if (!ok) {
    console.log('Cancelled.');
    return;
  }

  if (dryRun) {
    for (let i = 1; i <= count; i++) {
      const p = buildRealisticSeedProduct({ category, index: i, seedTag });
      console.log(`[DRY RUN] Would create:`, { title: p.title, price: p.price, stock: p.stock, category: p.category });
    }
    return;
  }

  const cookieHeader = await loginAndGetCookieHeader({ baseUrl, email, password });

  let created = 0;
  let failed = 0;

  for (let i = 1; i <= count; i++) {
    const product = buildRealisticSeedProduct({ category, index: i, seedTag });

    try {
      let img;
      let filename;
      let mimeType;

      if (imageFiles) {
        const filePath = imageFiles[i - 1]; // stable order
        const ext = path.extname(filePath);
        mimeType = extToMime(ext);
        if (!mimeType) throw new Error(`Unsupported image extension: ${ext}`);
        img = await fs.readFile(filePath);
        filename = path.basename(filePath);
      } else {
        img = await generateCategoryImagePng({ category, productIndex: i });
        filename = `seed_${slugifyCategory(category)}_${seedTag}_${String(i).padStart(2, '0')}.png`;
        mimeType = 'image/png';
      }

      const result = await createProductViaApi({
        baseUrl,
        cookieHeader,
        product,
        imageBuffer: img,
        filename,
        mimeType
      });

      created++;
      const createdId = result?.data?._id || result?.data?.id;
      const createdImage = result?.data?.image;
      console.log(`[OK] ${i}/${count}: ${product.title} -> id=${createdId || 'unknown'} image=${createdImage || 'unknown'}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${i}/${count}: ${product.title}: ${err?.message || err}`);
    }
  }

  console.log('--- Seed Summary ---');
  console.log({ category, count, created, failed });
  if (failed > 0) process.exitCode = 2;
}

main().catch((err) => {
  console.error('Seed script crashed:', err?.message || err);
  process.exitCode = 1;
});


