// Run the actual game state and physics at simulated 30, 60 and 144 FPS.
// This does not change the monitor's refresh rate or open the 3D renderer.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("@typescript/typescript6");

// Compile the project's TypeScript modules in memory for this Node test.
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const { createGameState, updateGameState } = require("../src/game/state.ts");
const { getTargetPosition } = require("../src/game/targets.ts");

const noInput = () => ({
  horizontal: 0,
  elevation: 0,
  fire: false,
  reset: false,
});

function simulate(fps, difficulty, targetIndex, warmup = 0) {
  const state = createGameState();
  updateGameState(state, { ...noInput(), difficulty }, 0);
  for (let i = 0; i < Math.round(warmup * fps); i++) {
    updateGameState(state, noInput(), 1 / fps);
  }

  state.x = [-5, 0, 5][targetIndex];
  state.elevation = 35;
  state.powerLevel = targetIndex + 1;
  updateGameState(state, { ...noInput(), fire: true }, 0);
  assert.equal(state.shotsFired, 1);

  let frames = 0;
  while (state.projectile && frames < fps * 10) {
    updateGameState(state, noInput(), 1 / fps);
    frames++;
  }
  assert.equal(
    state.projectile,
    null,
    "The projectile should eventually return",
  );
  return state.hitTargets.join(",");
}

for (const index of [0, 1, 2]) {
  const a = simulate(30, "normal", index);
  const b = simulate(144, "normal", index);
  assert.equal(a, b, "Normal-mode impacts must be independent of FPS");
  assert.equal(
    a.split(",")[index],
    "true",
    `Normal-mode target ${index + 1} must be reachable`,
  );
}

for (const difficulty of ["hard", "extreme"]) {
  for (const index of [0, 1, 2]) {
    const a = simulate(30, difficulty, index, 0.5);
    const b = simulate(144, difficulty, index, 0.5);
    assert.equal(
      a,
      b,
      `${difficulty}, target ${index + 1} changed outcome with FPS`,
    );
  }
}

for (const difficulty of ["hard", "extreme"]) {
  const x0 = getTargetPosition(0, difficulty, 0)[0];
  const x1 = getTargetPosition(0, difficulty, 0.5)[0];
  assert.notEqual(x0, x1, `${difficulty} should move the targets`);
}

const wonState = createGameState();
const events = [];
for (const index of [0, 1, 2]) {
  wonState.x = [-5, 0, 5][index];
  wonState.elevation = 35;
  wonState.powerLevel = index + 1;
  updateGameState(wonState, { ...noInput(), fire: true }, 0, (event) =>
    events.push(event),
  );
  for (let frame = 0; wonState.projectile && frame < 300; frame++) {
    updateGameState(wonState, noInput(), 1 / 60, (event) => events.push(event));
  }
}
assert.equal(wonState.shotsFired, 3);
assert.ok(
  wonState.hitTargets.every(Boolean),
  "Three targets should be defeated",
);
assert.equal(
  events.filter((event) => event.kind === "won").length,
  1,
  "Victory occurs once",
);

const state = createGameState();
updateGameState(state, { ...noInput(), difficulty: "extreme", fire: true }, 0);
updateGameState(state, { ...noInput(), reset: true }, 0);
assert.equal(state.difficulty, "normal");
assert.equal(state.projectile, null);
assert.equal(state.shotsFired, 0);
assert.ok(state.hitTargets.every((hit) => !hit));

console.log("OK: simulated 30 vs 144 FPS in all three difficulty modes.");
console.log("OK: targets move, victory triggers once and R resets the game.");
