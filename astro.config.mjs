// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
// Static output (no platform adapter needed — Netlify serves `dist/` directly).
// The Netlify adapter is added in spec 002 when Keystatic introduces server routes.
export default defineConfig({
  site: 'https://adrianebulhoes.com',
  integrations: [react()],
});