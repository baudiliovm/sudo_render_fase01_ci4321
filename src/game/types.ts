export interface TurretPose {
  x: number;
  /** Elevation in degrees, measured from the ground. */
  elevation: number;
}

export interface AimingInput {
  horizontal: number;
  elevation: number;
}
