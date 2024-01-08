import { keyMapObject, isFakerMapping } from '@/MockServer/faker';
import { distance } from 'fastest-levenshtein';
import { LRUCache } from 'lru-cache';

// 5MB Cache
const lru = new LRUCache({
  max: 5 * 1024 * 1024,
  ttl: 1000 * 60 * 60,
  maxSize: 1024 * 1024 * 10,
  sizeCalculation: (n: string, key: string): number => {
    return n.length + key.length;
  },
});

export const compare = (entry: string, all: keyMapObject[]): string => {
  if (lru.has(entry)) {
    return lru.get(entry) || '';
  }

  let minDistance = Infinity;
  let bestMatch = entry;
  for (const st of all) {
    const { name, mapping } = st;
    const check = [name];
    if (isFakerMapping(mapping)) {
      const { key, value } = mapping;
      check.push(...[key, value]);
    }
    check.forEach((value) => {
      if (!minDistance) {
        return;
      }
      const levenshteinDistance = distance(entry, value);
      if (levenshteinDistance < minDistance) {
        bestMatch = st.name;
        minDistance = levenshteinDistance;
      }
    });
    if (!minDistance) {
      break;
    }
  }

  lru.set(entry, bestMatch);
  return bestMatch;
};
