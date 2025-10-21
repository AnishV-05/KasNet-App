export function getCapitalized(s: string) {
  if (!s) return s
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(w => (w ? `${w[0].toUpperCase()}${w.slice(1)}` : ''))
    .join(' ')
}
