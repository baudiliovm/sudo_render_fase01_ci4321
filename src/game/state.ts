import { AIMING } from "../config/gameplay";
import { TARGETS } from "../config/scene";
import { firstImpact, launchProjectile } from "./physics";
import type { AimingInput, GameState } from "./types";

export function createGameState(): GameState {
  return {
    x: 0,
    elevation: AIMING.initialElevation,
    powerLevel: 1,
    projectile: null,
    hitTargets: TARGETS.map(() => false),
  };
}

export function updateGameState(
  state: GameState,
  input: AimingInput,
  dt: number,
): boolean {
  const { x, elevation, powerLevel } = state;
  if (input.powerLevel !== undefined) state.powerLevel = input.powerLevel;

  state.x = Math.max(
    AIMING.minX,
    Math.min(
      AIMING.maxX,
      state.x + input.horizontal * AIMING.movementSpeed * dt,
    ),
  );
  state.elevation = Math.max(
    AIMING.minElevation,
    Math.min(
      AIMING.maxElevation,
      state.elevation + input.elevation * AIMING.elevationSpeed * dt,
    ),
  );

  let changed =
    state.x !== x ||
    state.elevation !== elevation ||
    state.powerLevel !== powerLevel;
  if (input.fire && state.projectile === null) {
    state.projectile = launchProjectile(state, state.powerLevel);
    changed = true;
  }
  // Evaluate the ballistic formula from launch time, not by accumulating
  // a displacement per frame. This keeps the trajectory independent of FPS.
  if (state.projectile !== null && dt > 0) {
    const shot = state.projectile;
    const end = shot.elapsed + dt;
    const impact = firstImpact(shot, shot.elapsed, end, TARGETS, state.hitTargets);
    if (impact !== null) {
      if (impact.kind === "target") state.hitTargets[impact.index] = true;
      state.projectile = null;
    } else {
      shot.elapsed = end;
    }
    changed = true;
  }
  return changed;
}
