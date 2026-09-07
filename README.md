# Mis XV Años - Aylen Galarza

Invitación web para los 15 años de Aylen Galarza, publicada con GitHub Pages en:
https://marioagalarza.github.io/mis-15-Aylen/

## Estructura

```
index.html
css/
  style.css
js/
  commons.js
mascara_vestido.jpg
musica_invitacion.mp3
```

## Versionado y caché

Los assets propios (`css/style.css`, `js/commons.js`,
`musica_invitacion.mp3`, `mascara_vestido.jpg`) se referencian en
`index.html` con un parámetro `?v=<version>`, por ejemplo:

```html
<link rel="stylesheet" href="css/style.css?v=1.1.0">
```

GitHub Pages sirve todo con `Cache-Control: max-age=600` y no permite
configurar headers propios, así que el navegador puede seguir mostrando
una copia vieja hasta 10 minutos después de un deploy (o más, según el
caché del dispositivo). Al cambiar el número de versión en la query
string, la URL del archivo cambia y el navegador se ve forzado a
descargarlo de nuevo, sin importar el caché anterior.

**Regla:** cada vez que se modifique alguno de esos archivos, hay que:

1. Subir un nuevo registro al [Changelog](#changelog) con la versión nueva.
2. Actualizar el `?v=...` de ese archivo (y del resto, para simplificar)
   en `index.html` con la misma versión.

## Changelog

### 1.1.2 - 2026-09-07
- Eliminado `mascara_vestido.png` (archivo sin uso; la imagen de
  portada usa `mascara_vestido.jpg`).

### 1.1.1 - 2026-09-07
- Eliminado `musica_descendientes.mp3` (archivo sin uso, reemplazado por
  `musica_invitacion.mp3` en la versión 1.0.0).

### 1.1.0 - 2026-09-07
- Reorganización de archivos: `style.css` → `css/style.css`,
  `commons.js` → `js/commons.js`.
- Version bump a `1.1.0` en las referencias `?v=` de `index.html`.

### 1.0.0 - 2026-09-07
- Cambio de música: `musica_descendientes.mp3` → `musica_invitacion.mp3`.
- Nueva imagen de portada: `mascara_vestido.jpg` (reemplaza `mascara.jpeg`
  y las fotos `Aylen_1.jpg` a `Aylen_4.jpg`).
- Agregado cache-busting (`?v=`) a `style.css`, `commons.js`,
  `musica_invitacion.mp3` y `mascara_vestido.jpg` para evitar que
  GitHub Pages sirva versiones cacheadas tras cada deploy.
