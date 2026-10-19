// Node fixtures for migration/SSR tests. Vite replaces this entire module
// with websiteSeeds.browser.js before resolving its private JSON import.
import seeds from '../../server/data/websiteSeeds.json' with { type: 'json' };
import { websiteSeed as browserSeed } from './websiteSeeds.browser.js';
export function websiteSeed(name) {
  return typeof window !== 'undefined' ? browserSeed(name) : structuredClone(seeds[name] || []);
}
