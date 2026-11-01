import { AIMING } from '../config/gameplay';
import type { AimingInput, GameState } from './types';

export function createGameState(): GameState {
  return { x: 0, elevation: AIMING.initialElevation, powerLevel: 1 };
}

export function updateGameState(state: GameState, input: AimingInput, dt: number): void {
  if (input.powerLevel !== undefined) state.powerLevel = input.powerLevel;
  state.x = Math.max(AIMING.minX, Math.min(AIMING.maxX, state.x + input.horizontal * AIMING.movementSpeed * dt));
  state.elevation = Math.max(AIMING.minElevation, Math.min(AIMING.maxElevation, state.elevation + input.elevation * AIMING.elevationSpeed * dt));
}
