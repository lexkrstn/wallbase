export interface Rgb {
  r: number;
  g: number;
  b: number;
}

function colorToHex(color: number): string {
  return Math.max(Math.min(Math.round(color), 255), 0).toString(16).toUpperCase();
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
}
