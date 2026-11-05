import { mat4, type ReadonlyVec3 } from "gl-matrix";
import { COLORS, TARGETS } from "../config/scene";
import type { GameState } from "../game/types";
import type { SceneObject } from "../rendering/types";
import { createProjectile } from "./projectile";
import { createTurret } from "./turret";

export function transform(position: ReadonlyVec3, scale: ReadonlyVec3): mat4 {
  const model = mat4.fromTranslation(mat4.create(), position);
  return mat4.scale(model, model, scale);
}

export function createScene(state: GameState): SceneObject[] {
  const objects: SceneObject[] = [
    {
      mesh: "plane",
      model: transform([0, 0, -35], [80, 1, 120]),
      color: COLORS.ground,
    },
  ];
  for (const target of TARGETS) {
    objects.push({
      mesh: "sphere",
      model: transform(target.position, [
        target.radius,
        target.radius,
        target.radius,
      ]),
      color: COLORS.target,
    });
  }
  objects.push(...createTurret(state, state.powerLevel));
  objects.push(createProjectile(state, state.projectile));
  return objects;
}
