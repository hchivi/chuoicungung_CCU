export const MATCHING_CYCLE_MS = 4500;

export function nextMatchingIndex(index, count) {
  if (!Number.isInteger(index) || index < 0 || index >= count || count < 1) return 0;
  return (index + 1) % count;
}

export function matchingCanRun({ paused, reducedMotion, hidden, inView, hubFocused }) {
  return !paused && !reducedMotion && !hidden && inView && !hubFocused;
}
