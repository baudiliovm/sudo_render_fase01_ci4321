import { mat3, mat4, type ReadonlyMat4 } from 'gl-matrix';
import { ATTRIB, createFixedFunction, LIGHTING, type Color } from './vendor/ff/ff';
import { CANVAS_HEIGHT, CANVAS_WIDTH, CLEAR_COLOR } from './constants';
import { createBox, createCylinder, createPlane, createSphere, type MeshData } from './geometry';

export type MeshName = 'plane' | 'box' | 'sphere' | 'cylinder';

export interface SceneObject {
  mesh: MeshName;
  model: ReadonlyMat4;
  color: Color;
}

function uploadMesh(gl: WebGL2RenderingContext, data: MeshData) {
  const vao = gl.createVertexArray();
  const vertices = gl.createBuffer();
  const indices = gl.createBuffer();
  if (!vao || !vertices || !indices) throw new Error('Unable to allocate mesh buffers.');
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(ATTRIB.NORMAL);
  gl.vertexAttribPointer(ATTRIB.NORMAL, 3, gl.FLOAT, false, 24, 12);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return { vao, count: data.indices.length };
}

export function createRenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('webgl2', { antialias: true });
  if (!context) throw new Error('WebGL2 is not available.');
  const gl: WebGL2RenderingContext = context;
  const ff = createFixedFunction(gl, { debug: true });
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(...CLEAR_COLOR);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  ff.enable(LIGHTING);
  ff.setGlobalAmbient([0.36, 0.36, 0.38]);
  ff.setLight(0, { position: [-3, 7, 4, 0], diffuse: [0.75, 0.73, 0.70] });
  ff.enableLight(0);
  ff.setViewMatrix(mat4.lookAt(mat4.create(), [0, 11, 18], [0, 4, -16], [0, 1, 0]));
  ff.setProjectionMatrix(mat4.perspective(mat4.create(), 55 * Math.PI / 180, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 180));

  const meshes = {
    plane: uploadMesh(gl, createPlane()),
    box: uploadMesh(gl, createBox()),
    sphere: uploadMesh(gl, createSphere()),
    cylinder: uploadMesh(gl, createCylinder()),
  };
  const normal = mat3.create();

  return {
    render(objects: readonly SceneObject[]): void {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      for (const object of objects) {
        const mesh = meshes[object.mesh];
        ff.setModelMatrix(object.model);
        if (!mat3.normalFromMat4(normal, object.model)) throw new Error('Invalid model transform.');
        ff.setNormalMatrix(normal);
        ff.setMaterial({ ambient: object.color, diffuse: object.color, specular: [0.08, 0.08, 0.08], shininess: 16 });
        gl.bindVertexArray(mesh.vao);
        ff.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
      }
      gl.bindVertexArray(null);
    },
  };
}
