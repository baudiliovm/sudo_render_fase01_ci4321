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

export type Impact =
  | { kind: "target"; index: number; time: number }
  | { kind: "ground"; time: number };

function distanceSquared(
  shot: ActiveProjectile,
  centerAt: (time: number) => Vec3,
  time: number,
): number {
  const point = projectilePosition(shot, time);
  const center = centerAt(time);
  return (
    (point[0] - center[0]) ** 2 +
    (point[1] - center[1]) ** 2 +
    (point[2] - center[2]) ** 2
  );
}

/** Look for the first intersection along the projectile path. */
function sphereContact(
  shot: ActiveProjectile,
  centerAt: (time: number) => Vec3,
  combinedRadius: number,
  start: number,
  end: number,
): number | null {
  const radiusSquared = combinedRadius * combinedRadius;
  if (distanceSquared(shot, centerAt, start) <= radiusSquared) return start;

  // Test intermediate positions as well as the end of the frame.
  const steps = Math.max(1, Math.ceil((end - start) * 240));
  let previous = start;
  for (let i = 1; i <= steps; i++) {
    const current = start + ((end - start) * i) / steps;
    if (distanceSquared(shot, centerAt, current) <= radiusSquared) {
      let low = previous;
      let high = current;
      for (let k = 0; k < 24; k++) {
        const middle = (low + high) / 2;
        if (distanceSquared(shot, centerAt, middle) <= radiusSquared) {
          high = middle;
        } else {
          low = middle;
        }
      }
      return high;
    }
    previous = current;
  }
  return null;
}

export function firstImpact(
  shot: ActiveProjectile,
  start: number,
  end: number,
  targets: readonly { readonly position: Vec3; readonly radius: number }[],
  hitTargets: readonly boolean[],
  targetAt?: (index: number, time: number) => Vec3,
): Impact | null {
  const groundDiscriminant =
    shot.velocity[1] ** 2 +
    2 * PROJECTILE.gravity * (shot.origin[1] - PROJECTILE.radius);
  const groundTime =
    (shot.velocity[1] + Math.sqrt(Math.max(0, groundDiscriminant))) /
    PROJECTILE.gravity;

  let first: Impact | null =
    groundTime >= start && groundTime <= end
      ? { kind: "ground", time: groundTime }
      : null;

  for (let index = 0; index < targets.length; index++) {
    if (hitTargets[index]) continue;
    const target = targets[index];
    const contact = sphereContact(
      shot,
      (time) => targetAt?.(index, time) ?? target.position,
      target.radius + PROJECTILE.radius,
      start,
      Math.min(end, first?.time ?? end),
    );
    if (contact !== null && (first === null || contact < first.time)) {
      first = { kind: "target", index, time: contact };
    }
  }
  return first;
}
