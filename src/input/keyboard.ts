import type { AimingInput, Difficulty, PowerLevel } from "../game/types";

const POWER_KEYS = new Map<string, PowerLevel>([
  ["Digit1", 1],
  ["Digit2", 2],
  ["Digit3", 3],
  ["Numpad1", 1],
  ["Numpad2", 2],
  ["Numpad3", 3],
]);
const DIFFICULTY_KEYS = new Map<string, Difficulty>([
  ["Digit7", "normal"],
  ["Digit8", "hard"],
  ["Digit9", "extreme"],
  ["Numpad7", "normal"],
  ["Numpad8", "hard"],
  ["Numpad9", "extreme"],
]);

const CONTROL_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Space",
  "KeyR",
  ...POWER_KEYS.keys(),
  ...DIFFICULTY_KEYS.keys(),
]);

export function createKeyboardInput(target: Window) {
  const held = new Set<string>();
  let pendingPower: PowerLevel | undefined;
  let pendingFire = false;
  let pendingReset = false;
  let pendingDifficulty: Difficulty | undefined;

  const onKeyDown = (event: KeyboardEvent): void => {
    if (
      !CONTROL_KEYS.has(event.code) ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    event.preventDefault();
    if (event.code === "KeyR") {
      if (!event.repeat) pendingReset = true;
      return;
    }
    if (event.code === "Space") {
      if (!event.repeat) pendingFire = true;
      return;
    }
    const difficulty = DIFFICULTY_KEYS.get(event.code);
    if (difficulty !== undefined) {
      if (!event.repeat) pendingDifficulty = difficulty;
      return;
    }
    const powerLevel = POWER_KEYS.get(event.code);
    if (powerLevel !== undefined) {
      if (!event.repeat) pendingPower = powerLevel;
    } else {
      held.add(event.code);
    }
  };
  const onKeyUp = (event: KeyboardEvent): void => {
    if (!CONTROL_KEYS.has(event.code)) return;
    event.preventDefault();
    held.delete(event.code);
  };
  const clear = (): void => {
    held.clear();
    pendingPower = undefined;
    pendingFire = false;
    pendingReset = false;
    pendingDifficulty = undefined;
  };
  const onVisibilityChange = (): void => {
    if (target.document.hidden) clear();
  };

  target.addEventListener("keydown", onKeyDown);
  target.addEventListener("keyup", onKeyUp);
  target.addEventListener("blur", clear);
  target.document.addEventListener("visibilitychange", onVisibilityChange);

  return {
    read(): AimingInput {
      const powerLevel = pendingPower;
      const fire = pendingFire;
      const reset = pendingReset;
      const difficulty = pendingDifficulty;
      pendingPower = undefined;
      pendingFire = false;
      pendingReset = false;
      pendingDifficulty = undefined;
      return {
        horizontal:
          Number(held.has("ArrowRight")) - Number(held.has("ArrowLeft")),
        elevation: Number(held.has("ArrowUp")) - Number(held.has("ArrowDown")),
        powerLevel,
        fire,
        reset,
        difficulty,
      };
    },
    dispose(): void {
      target.removeEventListener("keydown", onKeyDown);
      target.removeEventListener("keyup", onKeyUp);
      target.removeEventListener("blur", clear);
      target.document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
    },
  };
}
