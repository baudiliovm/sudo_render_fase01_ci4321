import type { GameEvent, GameState } from "../game/types";

export function createHud(state: GameState): (event: GameEvent) => void {
  const hitCount = document.getElementById("hit-count");
  const shotCount = document.getElementById("shot-count");
  const gameMessage = document.getElementById("game-message");
  const difficultyName = document.getElementById("difficulty-name");
  if (!hitCount || !shotCount || !gameMessage || !difficultyName) {
    throw new Error("Game status elements not found.");
  }

  const update = () => {
    hitCount.textContent = `${state.hitTargets.filter(Boolean).length}/${state.hitTargets.length}`;
    shotCount.textContent = `${state.shotsFired}`;
    difficultyName.textContent = ({ normal: "Normal", hard: "Difícil", extreme: "Extremo" })[state.difficulty];
  };

  const notify = (event: GameEvent): void => {
    switch (event.kind) {
      case "fire":
        console.info(`[Sudo Render] Bala disparada (fuerza ${event.power}). Disparo ${event.shots}.`);
        gameMessage.textContent = "Bala en vuelo...";
        break;
      case "hit":
        console.info(`[Sudo Render] Objetivo ${event.index + 1} alcanzado (${event.hits}/${event.total}). Bala regresó al cañón.`);
        gameMessage.textContent = `¡Objetivo ${event.index + 1} alcanzado!`;
        break;
      case "ground":
        console.info("[Sudo Render] La bala tocó el suelo y regresó al cañón.");
        gameMessage.textContent = "Bala disponible";
        break;
      case "won":
        console.info(`[Sudo Render] ¡Felicidades, ganaste! 3/3 objetivos en ${event.shots} disparos.`);
        gameMessage.textContent = `¡Felicidades, ganaste en ${event.shots} disparos!`;
        break;
      case "reset":
        console.info("[Sudo Render] Partida reiniciada. Objetivos y bala restaurados.");
        gameMessage.textContent = "Nueva partida";
        break;
      case "difficulty": {
        const label = ({ normal: "Normal", hard: "Difícil", extreme: "Extremo" })[event.difficulty];
        console.info(`[Sudo Render] Dificultad seleccionada: ${label}.`);
        gameMessage.textContent = `Modo ${label}`;
        break;
      }
    }
    update();
  };

  update();
  return notify;
}
