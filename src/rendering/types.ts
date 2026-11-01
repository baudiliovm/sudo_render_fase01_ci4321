import type { ReadonlyMat4 } from 'gl-matrix';
import type { Color } from '../vendor/ff/ff';

export type MeshName = 'plane' | 'box' | 'sphere' | 'cylinder';

export interface SceneObject {
  mesh: MeshName;
  model: ReadonlyMat4;
  color: Color;
  unlit?: boolean;
}

