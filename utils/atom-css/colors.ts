export function generateColors(name: string) {
  const colors: Record<string, string> = {
    50: `var(--k-${name}-color-50)`,
    950: `var(--k-${name}-color-950)`,
    DEFAULT: `var(--k-${name}-color-DEFAULT)`,
  };
  for (let i = 100; i < 1000; i += 100) {
    colors[i] = `var(--k-${name}-color-${i})`;
  }
  return colors;
}
