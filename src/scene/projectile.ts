import { mat4 } from 'gl-matrix';
import { PROJECTILE } from '../config/gameplay';
import { COLORS } from '../config/scene';
import type { TurretPose } from '../game/types';
import type { SceneObject } from '../rendering/types';
import { getTurretTransforms } from './turret';

export function createLoadedProjectile(pose: TurretPose): SceneObject {
  const { muzzle } = getTurretTransforms(pose);
  // Offset by the radius so the sphere rests against the mouth of the tube.
  const model = mat4.translate(mat4.create(), muzzle, [0, 0, -PROJECTILE.radius]);
  mat4.scale(model, model, [PROJECTILE.radius, PROJECTILE.radius, PROJECTILE.radius]);
  return { mesh: 'sphere', model, color: COLORS.projectile };
}
