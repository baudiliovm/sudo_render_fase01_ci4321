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

La aplicación muestra un campo de tiro con suelo marrón y tres objetivos
esféricos a distintas alturas y profundidades, y una torreta gris formada por
un cuerpo, una pieza esférica y un tubo cilíndrico. Las primitivas se generan
mediante código y usan iluminación con normales por cara.

La cámara en perspectiva es fija, detrás y por encima de la torreta.

## Controles

- **Flechas izquierda y derecha:** desplazar la torreta lateralmente entre −8 y 8 unidades.
- **Flechas arriba y abajo:** cambiar la elevación entre 5° y 90°, ambos incluidos.
- **1, 2 y 3:** elegir el nivel de fuerza, también desde el teclado numérico.

Tres barras en la cara trasera del cuerpo muestran la fuerza seleccionada:
el nivel N enciende las N barras inferiores en verde claro. Las demás permanecen
en verde oscuro y la barra inferior siempre está encendida.

El cuerpo mantiene su orientación; la torreta y el tubo comparten el pivote de elevación.

Mantener una flecha produce movimiento continuo. Las teclas opuestas se cancelan
y el movimiento se detiene al perder el foco de la ventana.

La esfera negra reposa en la boca del tubo y acompaña el desplazamiento y la
elevación del cañón. El disparo todavía no está disponible.

## Compilación

```bash
npm run build
npm run preview
```

`build` comprueba TypeScript y genera la aplicación en `dist/`.
`preview` sirve la aplicación compilada para revisarla en el navegador.

## Referencia

Basado en el [laboratorio del cubo con FixedFunction](https://github.com/jorge-codes/computer-graphics-usb/tree/main/ci4321-computer-graphics-i/lab/03_cube_webgl) de Jorge Palacios. Los archivos de FixedFunction se conservan sin modificaciones.
