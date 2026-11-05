# Sudo Render · CI4321 · Fase 01

Proyecto de Computación Gráfica I con TypeScript, WebGL2 y FixedFunction.

## Integrantes

- Baudilio Velasquez
- Luis Isea

## Requisitos

- Node.js 20.19 o posterior de la rama 20, o Node.js 22.12 o posterior.
- npm.
- Navegador con soporte para WebGL2 y aceleración gráfica habilitada.

## Ejecución

```bash
git clone https://github.com/baudiliovm/sudo_render_fase01_ci4321.git
cd sudo_render_fase01_ci4321
npm ci
npm run dev
```

Abrir la dirección local indicada en la terminal.

## Escena

El juego muestra una torreta gris sobre un campo marrón y tres objetivos
esféricos a distintas alturas y profundidades. La cámara es fija, detrás y
por encima de la torreta. La escena se construye con primitivas 3D generadas
en código y se renderiza con WebGL2 y la biblioteca FixedFunction del curso.

## Controles

| Tecla                              | Acción                                                 |
| ---------------------------------- | ------------------------------------------------------ |
| Flechas izquierda / derecha        | Desplazar lateralmente la torreta, de −8 a 8 unidades. |
| Flechas arriba / abajo             | Cambiar la elevación del cañón, de 5° a 90°.           |
| `1`, `2`, `3` (o teclado numérico) | Elegir uno de los tres niveles de fuerza.              |
| `Espacio`                          | Disparar cuando la bala está disponible.               |
| `R`                                | Reiniciar el juego y recuperar los objetivos.          |
| `7`, `8`, `9` (o teclado numérico) | Elegir dificultad Normal, Difícil o Extremo.           |

Tres barras en la parte trasera de la torreta indican el nivel de fuerza:
las barras activas se muestran en verde claro y las inactivas en verde oscuro.
La barra inferior permanece encendida. No hay controles de cámara.

## Cómo jugar

La esfera negra empieza en la boca del cañón. Ajustamos el desplazamiento
horizontal, la inclinación y la fuerza, y presionamos `Espacio` para lanzar
la bala. Cada disparo describe una parábola bajo la gravedad.

Solamente puede haber una bala en vuelo. Al tocar un objetivo, este desaparece;
al tocar un objetivo o el suelo, la bala vuelve a quedar disponible en la
punta del cañón. Los disparos no tienen límite y los objetivos alcanzados no
reaparecen hasta presionar `R`.

Los niveles de fuerza utilizan velocidades iniciales de 12, 17 y 22 unidades
por segundo, respectivamente, con gravedad de 9,8 unidades por segundo al
cuadrado. El movimiento se calcula a partir del tiempo transcurrido desde el
disparo, no como un avance fijo por fotograma.

Como referencia para practicar, con una elevación cercana a 35° podemos
apuntar a los objetivos desde los desplazamientos laterales −5, 0 y 5,
utilizando los niveles de fuerza 1, 2 y 3, respectivamente.

## Marcador y dificultades

El marcador situado encima de la escena muestra los aciertos (de 3), los disparos
realizados y la dificultad actual. Al destruir los tres objetivos aparece un
mensaje de victoria con la cantidad de disparos utilizados. La consola del
navegador registra eventos puntuales (disparo, impacto, recarga, reinicio y victoria)
con `console.info`, sin imprimir mensajes en cada fotograma.

- **7 — Normal:** los tres objetivos se quedan quietos en las posiciones originales.
- **8 — Difícil:** los tres objetivos se mueven horizontalmente de manera suave.
- **9 — Extremo:** el movimiento horizontal es más rápido, sin cambiar el tamaño de los objetivos.

Al seleccionar una dificultad, los blancos empiezan a moverse desde su posición
original. Las colisiones se calculan con sus posiciones durante el vuelo, no con
las posiciones fijas. Reiniciar con `R` devuelve la dificultad a Normal y pone el
contador de disparos y aciertos en cero.

## Verificación de 30 y 144 FPS

```bash
npm run test:fps
```

Esta prueba ejecuta la lógica real de física y colisiones con pasos de tiempo de
`1/30` y `1/144` segundos, compara los resultados para los tres niveles de
dificultad y verifica el reinicio.

## Compilación

```bash
npm run build
npm run preview
```

`build` comprueba TypeScript y genera la aplicación en `dist/`.
`preview` sirve la aplicación compilada para revisarla en el navegador.

## Verificaciones realizadas

1. Disparar y comprobar que una segunda pulsación de `Espacio` no crea otra bala mientras la primera está volando.
2. Probar los tres niveles de fuerza y comprobar que los objetivos alcanzados desaparecen.
3. Disparar fuera de los objetivos y comprobar que la bala vuelve al cañón cuando toca el suelo.
4. Mover o inclinar la torreta durante el vuelo y comprobar que el disparo ya realizado no cambia de trayectoria.
5. Presionar `R` durante un disparo y después de alcanzar objetivos: deben recuperarse las tres esferas y reiniciarse la torreta y la fuerza.
6. Verificar el comportamiento a distintas tasas de FPS y que la consola no muestre errores ni advertencias.

## Referencia

Basado en el [laboratorio del cubo con FixedFunction](https://github.com/jorge-codes/computer-graphics-usb/tree/main/ci4321-computer-graphics-i/lab/03_cube_webgl) de Jorge Palacios. Los archivos de FixedFunction se conservan sin modificaciones.
