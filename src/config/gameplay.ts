export const AIMING = {
  minX: -8,
  maxX: 8,
  movementSpeed: 6,
  initialElevation: 35,
  minElevation: 5,
  maxElevation: 90,
  elevationSpeed: 45,
} as const;

export const PROJECTILE = {
  radius: 0.18,
  /** Initial speeds for power levels 1, 2 and 3 (world units per second). */
  speeds: [12, 17, 22],
} as const;
