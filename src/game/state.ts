import { AIMING } from "../config/gameplay";
import { TARGETS } from "../config/scene";
import { firstImpact, launchProjectile } from "./physics";
import { getTargetPosition } from "./targets";
import type { AimingInput, GameEvent, GameState } from "./types";

export function createGameState(): GameState {
  return {
    x: 0,
    elevation: AIMING.initialElevation,
    powerLevel: 1,
    projectile: null,
    hitTargets: TARGETS.map(() => false),
    shotsFired: 0,
    difficulty: "normal",
    targetTime: 0,
  };
}

export function resetGameState(state: GameState): void {
  Object.assign(state, createGameState());
}

export function updateGameState(
  state: GameState,
  input: AimingInput,
  dt: number,
  onEvent?: (event: GameEvent) => void,
): boolean {
  if (input.reset) {
    resetGameState(state);
    onEvent?.({ kind: "reset" });
    return true;
  }

  const { x, elevation, powerLevel } = state;
  let changed = false;
  if (input.difficulty !== undefined && input.difficulty !== state.difficulty) {
    state.difficulty = input.difficulty;
    state.targetTime = 0;
    onEvent?.({ kind: "difficulty", difficulty: state.difficulty });
    changed = true;
  }
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

  changed =
    changed ||
    state.x !== x ||
    state.elevation !== elevation ||
    state.powerLevel !== powerLevel;
  if (input.fire && state.projectile === null) {
    state.projectile = launchProjectile(state, state.powerLevel);
    state.shotsFired++;
    onEvent?.({ kind: "fire", power: state.powerLevel, shots: state.shotsFired });
    changed = true;
  }
  // Evaluate the ballistic formula from launch time, not by accumulating
  // a displacement per frame. This keeps the trajectory independent of FPS.
  if (state.projectile !== null && dt > 0) {
    const shot = state.projectile;
    const end = shot.elapsed + dt;
    const impact = firstImpact(
      shot,
      shot.elapsed,
      end,
      TARGETS,
      state.hitTargets,
      (index, shotTime) =>
        getTargetPosition(
          index,
          state.difficulty,
          state.targetTime + (shotTime - shot.elapsed),
        ),
    );
    if (impact !== null) {
      if (impact.kind === "target") {
        state.hitTargets[impact.index] = true;
        const hits = state.hitTargets.filter(Boolean).length;
        onEvent?.({ kind: "hit", index: impact.index, hits, total: TARGETS.length });
        if (hits === TARGETS.length) onEvent?.({ kind: "won", shots: state.shotsFired });
      } else {
        onEvent?.({ kind: "ground" });
      }
      state.projectile = null;
    } else {
      shot.elapsed = end;
    }
    changed = true;
  }
  if (dt > 0 && state.difficulty !== "normal") {
    state.targetTime += dt;
    if (state.hitTargets.some((hit) => !hit)) changed = true;
  }
  return changed;
}
