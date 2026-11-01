export interface TurretPose {
  x: number;
  /** Elevation in degrees, measured from the ground. */
  elevation: number;
}

export interface AimingInput {
  horizontal: number;
  elevation: number;
  powerLevel?: PowerLevel;
}

export type PowerLevel = 1 | 2 | 3;

export interface GameState extends TurretPose {
  powerLevel: PowerLevel;
}
