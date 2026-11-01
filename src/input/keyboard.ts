import type { AimingInput } from '../game/types';

const CONTROL_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

export function createKeyboardInput(target: Window) {
  const held = new Set<string>();
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!CONTROL_KEYS.has(event.code) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    held.add(event.code);
  };
  const onKeyUp = (event: KeyboardEvent): void => {
    if (!CONTROL_KEYS.has(event.code)) return;
    event.preventDefault();
    held.delete(event.code);
  };
  const clear = (): void => held.clear();
  const onVisibilityChange = (): void => {
    if (target.document.hidden) clear();
  };
  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  target.addEventListener('blur', clear);
  target.document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    read(): AimingInput {
      return {
        horizontal: Number(held.has('ArrowRight')) - Number(held.has('ArrowLeft')),
        elevation: Number(held.has('ArrowUp')) - Number(held.has('ArrowDown')),
      };
    },
    dispose(): void {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      target.removeEventListener('blur', clear);
      target.document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
