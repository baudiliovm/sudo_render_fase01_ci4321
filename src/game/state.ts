import { AIMING } from '../config/gameplay';
import type { TurretPose } from './types';

export function createGameState(): TurretPose {
  return { x: 0, elevation: AIMING.initialElevation };
}

export function updateGameState(state: TurretPose, horizontal: number, dt: number): void {
  state.x = Math.max(AIMING.minX, Math.min(AIMING.maxX, state.x + horizontal * AIMING.movementSpeed * dt));
}
