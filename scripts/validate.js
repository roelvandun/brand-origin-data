#!/usr/bin/env node
// scripts/validate.js
// Validates brands.json against schema.json and enforces custom business rules.
// Exits 0 on success, 1 on failure. Designed to run in CI.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Ajv from 'ajv/dist/2020.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Load files
// ---------------------------------------------------------------------------

let brands;
let schema;

try {
  brands = JSON.parse(readFileSync(join(ROOT, 'brands.json'), 'utf8'));
} catch (err) {
  console.error('ERROR: Could not read brands.json:', err.message);
  process.exit(1);
}

try {
  schema = JSON.parse(readFileSync(join(ROOT, 'schema.json'), 'utf8'));
} catch (err) {
  console.error('ERROR: Could not read schema.json:', err.message);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. JSON Schema validation
// ---------------------------------------------------------------------------

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(brands);

let errors = 0;

if (!valid) {
  for (const err of validate.errors) {
    console.error(`SCHEMA ERROR at ${err.instancePath || '(root)'}: ${err.message}`);
    errors++;
  }
}

// ---------------------------------------------------------------------------
// 3. EU member state codes (27 members as of 2024)
// ---------------------------------------------------------------------------

const EU_MEMBERS = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

// ---------------------------------------------------------------------------
// 4. Custom rule checks
// ---------------------------------------------------------------------------

const seenBrands = new Map(); // brand name (lowercased) -> first index

for (let i = 0; i < brands.length; i++) {
  const entry = brands[i];
  const idx = i + 1; // 1-based for human-readable output

  // 4a. No leading/trailing whitespace in brand name
  if (typeof entry.brand === 'string' && entry.brand !== entry.brand.trim()) {
    console.error(`WHITESPACE ERROR [entry ${idx}]: brand "${entry.brand}" has leading/trailing whitespace`);
    errors++;
  }

  // 4b. Uniqueness
  if (typeof entry.brand === 'string') {
    const key = entry.brand.toLowerCase();
    if (seenBrands.has(key)) {
      console.error(
        `DUPLICATE ERROR [entry ${idx}]: brand "${entry.brand}" is a duplicate of entry ${seenBrands.get(key)}`
      );
      errors++;
    } else {
      seenBrands.set(key, idx);
    }
  }

  // 4c. eu_member consistency with hq_country
  if (typeof entry.hq_country === 'string' && typeof entry.eu_member === 'boolean') {
    const shouldBeEU = EU_MEMBERS.has(entry.hq_country);
    if (entry.eu_member !== shouldBeEU) {
      console.error(
        `EU_MEMBER ERROR [entry ${idx}]: brand "${entry.brand}" has hq_country "${entry.hq_country}" ` +
        `but eu_member is ${entry.eu_member} (expected ${shouldBeEU})`
      );
      errors++;
    }
  }

  // 4d. Alphabetical sort order (case-insensitive)
  if (i > 0) {
    const prev = brands[i - 1];
    if (
      typeof entry.brand === 'string' &&
      typeof prev.brand === 'string' &&
      entry.brand.toLowerCase() < prev.brand.toLowerCase()
    ) {
      console.error(
        `SORT ERROR [entry ${idx}]: "${entry.brand}" appears before "${prev.brand}" — ` +
        `brands.json must be sorted alphabetically (case-insensitive)`
      );
      errors++;
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Result
// ---------------------------------------------------------------------------

if (errors === 0) {
  console.log(`OK: brands.json is valid (${brands.length} entries)`);
  process.exit(0);
} else {
  console.error(`\nFAILED: ${errors} error(s) found in brands.json`);
  process.exit(1);
}
