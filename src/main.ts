import './styles/main.css';
import { createRenderer } from './rendering/renderer';
import { createScene } from './scene/scene';
import { createGameState, updateGameState } from './game/state';
import { createKeyboardInput } from './input/keyboard';

const canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Torreta gris frente a tres objetivos esféricos en un campo de tiro');
const stage = document.getElementById('stage');
if (!stage) throw new Error('Stage element not found.');
stage.append(canvas);

const renderer = createRenderer(canvas);
const state = createGameState();
const keyboard = createKeyboardInput(window);
let lastTime: number | null = null;

document.addEventListener('visibilitychange', () => { lastTime = null; });

function frame(now: number): void {
  const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  updateGameState(state, keyboard.readHorizontal(), dt);
  renderer.render(createScene(state));
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
