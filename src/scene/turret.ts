import { mat4, type ReadonlyMat4, type ReadonlyVec3 } from "gl-matrix";
import { COLORS } from "../config/scene";
import type { PowerLevel, TurretPose } from "../game/types";
import type { MeshName, SceneObject } from "../rendering/types";
import type { Color } from "../vendor/ff/ff";

export const TURRET = {
  pivotHeight: 1.6,
  barrelLength: 2.45,
} as const;

export function getTurretTransforms(pose: TurretPose) {
  const body = mat4.fromTranslation(mat4.create(), [pose.x, 0, 0]);
  const aiming = mat4.translate(mat4.create(), body, [
    0,
    TURRET.pivotHeight,
    0,
  ]);
  mat4.rotateX(aiming, aiming, (pose.elevation * Math.PI) / 180);
  const muzzle = mat4.translate(mat4.create(), aiming, [
    0,
    0,
    -TURRET.barrelLength,
  ]);
  return { body, aiming, muzzle };
}

export function createTurret(
  pose: TurretPose,
  powerLevel: PowerLevel,
): SceneObject[] {
  const { body, aiming } = getTurretTransforms(pose);
  const objects: SceneObject[] = [];
  const part = (
    mesh: MeshName,
    parent: ReadonlyMat4,
    position: ReadonlyVec3,
    scale: ReadonlyVec3,
    color: Color,
    unlit = false,
  ) => {
    const model = mat4.translate(mat4.create(), parent, position);
    mat4.scale(model, model, scale);
    objects.push({ mesh, model, color, unlit });
  };

  part("box", body, [0, 0.14, 0], [3.0, 0.28, 2.8], COLORS.base);
  part("box", body, [0, 0.755, 0], [2.65, 0.95, 2.45], COLORS.body);
  part("box", body, [0, 1.25, 0], [2.8, 0.14, 2.6], COLORS.turret);

  part("sphere", aiming, [0, 0, 0], [0.72, 0.72, 0.72], COLORS.turret);
  part("cylinder", aiming, [0, 0, -0.25], [0.18, 0.18, 2.2], COLORS.barrel);
  part("cylinder", aiming, [0, 0, -0.3], [0.26, 0.26, 0.55], COLORS.base);
  part("cylinder", aiming, [0, 0, -2.25], [0.24, 0.24, 0.2], COLORS.turret);
  part("cylinder", aiming, [0, 0, -2.45], [0.165, 0.165, 0.002], COLORS.muzzle);

  part("box", body, [0, 0.74, 1.25], [1.65, 0.86, 0.04], COLORS.base);
  for (let i = 0; i < 3; i++) {
    part(
      "box",
      body,
      [0, 0.47 + i * 0.27, 1.29],
      [1.3, 0.14, 0.035],
      i < powerLevel ? COLORS.powerOn : COLORS.powerOff,
      true,
    );
  }
  return objects;
}
