export interface MeshData {
  /** Interleaved position and normal: x, y, z, nx, ny, nz. */
  vertices: Float32Array;
  indices: Uint16Array;
}

type Point = readonly [number, number, number];

class MeshBuilder {
  private vertices: number[] = [];

  triangle(a: Point, b: Point, c: Point, outward: Point): void {
    const u = b.map((value, i) => value - a[i]);
    const v = c.map((value, i) => value - a[i]);
    let normal = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    const length = Math.hypot(...normal);
    if (length < 1e-10) return;
    if (normal.reduce((sum, value, i) => sum + value * outward[i], 0) < 0) {
      [b, c] = [c, b];
      normal = normal.map((value) => -value);
    }
    normal = normal.map((value) => value / length);
    for (const point of [a, b, c]) this.vertices.push(...point, ...normal);
  }

  quad(a: Point, b: Point, c: Point, d: Point, outward: Point): void {
    this.triangle(a, b, c, outward);
    this.triangle(a, c, d, outward);
  }

  build(): MeshData {
    const count = this.vertices.length / 6;
    if (count > 65536)
      throw new RangeError("Mesh exceeds the Uint16 index range.");
    return {
      vertices: new Float32Array(this.vertices),
      indices: Uint16Array.from({ length: count }, (_, i) => i),
    };
  }
}

/** Unit square on the XZ plane, facing up. */
export function createPlane(): MeshData {
  const mesh = new MeshBuilder();
  mesh.quad(
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [0.5, 0, 0.5],
    [-0.5, 0, 0.5],
    [0, 1, 0],
  );
  return mesh.build();
}

/** Unit box centered at the origin. Each face has its own normals. */
export function createBox(): MeshData {
  const mesh = new MeshBuilder();
  for (let axis = 0; axis < 3; axis++) {
    for (const sign of [-1, 1]) {
      const normal: [number, number, number] = [0, 0, 0];
      normal[axis] = sign;
      const corners = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ].map(([u, v]) => {
        const point: [number, number, number] = [0, 0, 0];
        point[axis] = sign * 0.5;
        point[(axis + 1) % 3] = u * 0.5;
        point[(axis + 2) % 3] = v * 0.5;
        return point;
      });
      mesh.quad(corners[0], corners[1], corners[2], corners[3], normal);
    }
  }
  return mesh.build();
}

function checkSegments(value: number, minimum: number, maximum: number): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(
      `Segments must be an integer between ${minimum} and ${maximum}.`,
    );
  }
}

/** Radius-one sphere with faceted lighting; no degenerate triangles at the poles. */
export function createSphere(slices = 20, stacks = 12): MeshData {
  checkSegments(slices, 3, 128);
  checkSegments(stacks, 2, 64);
  const mesh = new MeshBuilder();
  const point = (stack: number, slice: number): Point => {
    const latitude = -Math.PI / 2 + (Math.PI * stack) / stacks;
    const longitude = (2 * Math.PI * slice) / slices;
    return [
      Math.cos(latitude) * Math.cos(longitude),
      Math.sin(latitude),
      Math.cos(latitude) * Math.sin(longitude),
    ];
  };
  for (let j = 0; j < stacks; j++) {
    for (let i = 0; i < slices; i++) {
      const a = point(j, i),
        b = point(j, i + 1),
        c = point(j + 1, i + 1),
        d = point(j + 1, i);
      const outward = point(j + 0.5, i + 0.5);
      mesh.quad(a, b, c, d, outward);
    }
  }
  return mesh.build();
}

/** Closed cylinder, radius one, from z=0 to z=-1. */
export function createCylinder(segments = 20): MeshData {
  checkSegments(segments, 3, 128);
  const mesh = new MeshBuilder();
  for (let i = 0; i < segments; i++) {
    const a = (2 * Math.PI * i) / segments,
      b = (2 * Math.PI * (i + 1)) / segments;
    const p: Point = [Math.cos(a), Math.sin(a), 0],
      q: Point = [Math.cos(b), Math.sin(b), 0];
    const r: Point = [q[0], q[1], -1],
      s: Point = [p[0], p[1], -1];
    mesh.quad(p, q, r, s, [Math.cos((a + b) / 2), Math.sin((a + b) / 2), 0]);
    mesh.triangle([0, 0, 0], p, q, [0, 0, 1]);
    mesh.triangle([0, 0, -1], r, s, [0, 0, -1]);
  }
  return mesh.build();
}
