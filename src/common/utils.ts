export function hexToString(n: number | undefined): string | undefined {
  if (n) return '#' + n.toString(16)
  return undefined
}
