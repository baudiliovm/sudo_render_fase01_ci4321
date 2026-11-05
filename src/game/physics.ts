import { PROJECTILE } from "../config/gameplay";
import { getTurretTransforms } from "../scene/turret";
import type { ActiveProjectile, PowerLevel, TurretPose, Vec3 } from "./types";

export function launchProjectile(
  pose: TurretPose,
  powerLevel: PowerLevel,
): ActiveProjectile {
  const { muzzle } = getTurretTransforms(pose);
  const angle = (pose.elevation * Math.PI) / 180;
  const speed = PROJECTILE.speeds[powerLevel - 1];
  const direction: Vec3 = [0, Math.sin(angle), -Math.cos(angle)];

  // The ball starts just beyond the barrel mouth, as when it is loaded.
  const origin: Vec3 = [
    muzzle[12],
    muzzle[13] + direction[1] * PROJECTILE.radius,
    muzzle[14] + direction[2] * PROJECTILE.radius,
  ];

  return {
    origin,
    velocity: [0, direction[1] * speed, direction[2] * speed],
    elapsed: 0,
  };
}

export function projectilePosition(
  shot: ActiveProjectile,
  time = shot.elapsed,
): Vec3 {
  return [
    shot.origin[0] + shot.velocity[0] * time,
    shot.origin[1] +
      shot.velocity[1] * time -
      0.5 * PROJECTILE.gravity * time * time,
    shot.origin[2] + shot.velocity[2] * time,
  ];
}
