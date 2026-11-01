import type { Color } from './vendor/ff/ff';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;
export const CLEAR_COLOR = [0x87 / 255, 0xce / 255, 0xeb / 255, 1] as const;

export const COLORS = {
  ground: [0.55, 0.30, 0.14],
  target: [0.95, 0.22, 0.065],
  body: [0.19, 0.22, 0.25],
  base: [0.13, 0.15, 0.18],
  turret: [0.24, 0.27, 0.30],
  barrel: [0.19, 0.22, 0.25],
  muzzle: [0.07, 0.08, 0.09],
} satisfies Record<string, Color>;

export const TARGETS = [
  { position: [-5, 4.983, -11.837], radius: 1.3 },
  { position: [0, 6.595, -22.895], radius: 1.3 },
  { position: [5, 8.623, -38.050], radius: 1.3 },
] as const;
