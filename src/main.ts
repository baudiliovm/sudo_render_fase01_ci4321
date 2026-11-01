import './style.css';
import { createRenderer } from './renderer';
import { createScene } from './scene';

const canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Campo de tiro con tres objetivos esféricos');
const stage = document.getElementById('stage');
if (!stage) throw new Error('Stage element not found.');
stage.append(canvas);

const renderer = createRenderer(canvas);
renderer.render(createScene());
