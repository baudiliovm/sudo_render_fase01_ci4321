import { TARGETS } from "../config/scene";
import type { Difficulty, Vec3 } from "./types";

// The normal mode keeps the targets at their original positions.
// In the other modes, x depends on elapsed game time, not on the frame count.
export function getTargetPosition(
  index: number,
  difficulty: Difficulty,
  time: number,
): Vec3 {
  const [x, y, z] = TARGETS[index].position;
  if (difficulty === "normal") return [x, y, z];

  const amplitude = 1.75;
  const angularSpeed = (difficulty === "hard" ? 0.85 : 1.45) * (1 + index * 0.12);
  const direction = index % 2 === 0 ? 1 : -1;
  return [x + direction * amplitude * Math.sin(angularSpeed * Math.max(0, time)), y, z];
}
