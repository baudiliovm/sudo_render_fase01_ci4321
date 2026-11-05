export type Vec3 = readonly [number, number, number];

export interface TurretPose {
  x: number;
  /** Elevation in degrees, measured from the ground. */
  elevation: number;
}

export type PowerLevel = 1 | 2 | 3;

export interface AimingInput {
  horizontal: number;
  elevation: number;
  powerLevel?: PowerLevel;
  fire: boolean;
}

export interface ActiveProjectile {
  /** Position of the projectile when it leaves the barrel. */
  origin: Vec3;
  /** Initial velocity in world coordinates. */
  velocity: Vec3;
  elapsed: number;
}

export interface GameState extends TurretPose {
  powerLevel: PowerLevel;
  projectile: ActiveProjectile | null;
}
