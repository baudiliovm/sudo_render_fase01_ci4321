import './style.css';
import { createRenderer } from './renderer';
import { createScene } from './scene';

const canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Torreta gris frente a tres objetivos esféricos en un campo de tiro');
const stage = document.getElementById('stage');
if (!stage) throw new Error('Stage element not found.');
stage.append(canvas);

const renderer = createRenderer(canvas);
renderer.render(createScene());
