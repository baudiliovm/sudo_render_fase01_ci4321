import { AIMING } from '../config/gameplay';
import type { AimingInput, TurretPose } from './types';

export function createGameState(): TurretPose {
  return { x: 0, elevation: AIMING.initialElevation };
}

export function updateGameState(state: TurretPose, input: AimingInput, dt: number): void {
  state.x = Math.max(AIMING.minX, Math.min(AIMING.maxX, state.x + input.horizontal * AIMING.movementSpeed * dt));
  state.elevation = Math.max(AIMING.minElevation, Math.min(AIMING.maxElevation, state.elevation + input.elevation * AIMING.elevationSpeed * dt));
}
