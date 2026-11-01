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

## Controles

La aplicación muestra un cubo iluminado que gira sobre su eje vertical.

- **Espacio:** cambiar el color del cubo.
- **R:** detener o reanudar la rotación.

Cada pulsación se procesa una vez; mantener la tecla no repite la acción.

## Compilación

```bash
npm run build
npm run preview
```

`build` comprueba TypeScript y genera la aplicación en `dist/`.
`preview` sirve la aplicación compilada para revisarla en el navegador.

## Referencia

Basado en el [laboratorio del cubo con FixedFunction](https://github.com/jorge-codes/computer-graphics-usb/tree/main/ci4321-computer-graphics-i/lab/03_cube_webgl) de Jorge Palacios. Los archivos de FixedFunction se conservan sin modificaciones.
