# Documentación de decisiones del proyecto

Registro detallado de qué se hizo en el sitio y **por qué**, en orden
cronológico. El [Changelog del README](../README.md#changelog) tiene
la versión resumida; acá está el razonamiento detrás de cada cambio.

## Música: `musica_descendientes.mp3` → `musica_invitacion.mp3`

**Qué:** se cambió el archivo de audio de fondo referenciado en
`index.html`.

**Por qué:** pedido directo — la música de fondo pasó a ser
"invitación" en vez de "descendientes". Más adelante, una vez
confirmado que ya no quedaba ninguna referencia al archivo viejo, se
eliminó `musica_descendientes.mp3` del repo por quedar huérfano.

## Cache-busting (`?v=<version>` en los assets)

**Qué:** cada asset propio (`css/style.css`, `js/commons.js`,
`audio/musica_invitacion.mp3`, `imagenes/mascara_vestido.jpg`) se
referencia con un parámetro `?v=` en `index.html`.

**Por qué:** al publicar el cambio de música en GitHub Pages, el sitio
seguía mostrando la versión anterior. Investigando, GitHub Pages
manda siempre `Cache-Control: max-age=600` (10 minutos) en todos los
archivos, y **no permite configurar headers propios** (no hay
`_headers` como en Netlify ni `vercel.json`) — así que no se puede
"bajar" ese cache-control desde el repo. La solución estándar para
este tipo de hosting es cache-busting: al cambiar el número de
versión, la URL del archivo cambia y el navegador se ve forzado a
descargarlo de nuevo, sin importar cuánto falte para que expire el
caché anterior.

**Regla operativa:** cada vez que se modifica alguno de esos archivos,
hay que subir el número de versión en su referencia dentro de
`index.html` (y, por prolijidad, en el resto de assets también).

## Versionado semántico + Changelog en el README

**Qué:** se adoptó un número de versión (`MAJOR.MINOR.PATCH`) que es
a la vez el registro de cambios del proyecto y el valor usado en el
cache-busting de arriba.

**Por qué:** unificar ambas necesidades (documentar cambios +
invalidar caché) en un solo número evita mantener dos sistemas
paralelos y hace que cualquier persona pueda ver, mirando el
`?v=` de un archivo, a qué entrada del changelog corresponde.

## Reorganización en carpetas (`css/`, `js/`, `audio/`, `imagenes/`)

**Qué:** los archivos que antes vivían sueltos en la raíz del repo
(`style.css`, `commons.js`, `musica_invitacion.mp3`,
`mascara_vestido.jpg`) se movieron a carpetas por tipo de asset.

**Por qué:** es la convención habitual en un proyecto estático
(separar código de estilos, de scripts, de media) y facilita
encontrar y mantener cada tipo de archivo a medida que el proyecto
crece. Se usó `git mv` en cada caso para que git registre el
movimiento como rename y no como borrado + creación, preservando el
historial de cada archivo.

De paso se creó y luego se eliminó una carpeta `video/`: se agregó
"por si acaso" pero, al no haber ningún archivo de video en el
proyecto, se sacó para no dejar una carpeta vacía sin propósito real
en el repo (solo sobrevivía por un `.gitkeep`).

## Limpieza de archivos sin uso

**Qué:** se eliminaron `musica_descendientes.mp3` y
`mascara_vestido.png`.

**Por qué:** antes de borrar cualquier archivo se verificó con `grep`
que ninguna referencia activa en `index.html`, `css/style.css` o
`js/commons.js` apuntara a ellos. Ambos habían quedado huérfanos
después de reemplazos anteriores (música e imagen de portada) y no
aportaban nada estando en el repo — solo peso muerto.

## Auditoría de estándares y convenciones

**Qué:** se revisó el proyecto contra las convenciones típicas de un
sitio estático HTML/CSS/JS (semántica, separación de responsabilidades,
accesibilidad básica, meta tags, manejo de assets).

**Por qué:** para tener un diagnóstico objetivo de qué tan cerca está
el sitio de las buenas prácticas de producción, más allá de que
"funcione". De esa auditoría salió el plan de mejoras que sigue.

### Meta tags Open Graph / Twitter Card / `theme-color`

**Qué:** se agregaron `<meta name="description">`, el set de
`og:*` (`type`, `title`, `description`, `image`, `url`, `locale`),
`twitter:card` y `theme-color`.

**Por qué:** sin estos tags, al pegar el link de la invitación en
WhatsApp (el canal principal por el que se va a compartir) no se
genera ninguna vista previa con imagen/título — llega como un link
pelado. Es el cambio de mayor impacto práctico de todo el plan,
porque afecta directamente la primera impresión de quien recibe la
invitación.

### Favicon

**Qué:** se agregó `imagenes/favicon.svg` (un ícono de máscara 🎭
sobre fondo del color de marca del sitio) y su `<link rel="icon">`.

**Por qué:** sin favicon, cada carga de página dispara un pedido a
`/favicon.ico` que responde 404. Es un detalle menor de pulido, pero
es la diferencia entre una pestaña de navegador genérica y una con
identidad propia.

### Estilos inline → CSS

**Qué:** se sacaron los dos `style="..."` que quedaban en
`index.html` (`#main-content` y el link de WhatsApp) y se convirtieron
en reglas de `css/style.css` (`#main-content`, `.link-whatsapp`).

**Por qué:** tener CSS separado en su propio archivo pierde sentido
si igual quedan estilos sueltos como atributos en el HTML — la
separación de responsabilidades (HTML = estructura, CSS = estilo) se
había logrado a medias. Se verificó con Playwright que el
comportamiento visual (la animación de apertura y el color del link)
no cambió tras la migración.

### Reformateo de indentación en `css/style.css` y `js/commons.js`

**Qué:** ambos archivos se reindentaron para arrancar en columna 0.

**Por qué:** conservaban la sangría de 8 espacios de cuando el CSS y
el JS vivían embebidos dentro de `<style>`/`<script>` en el propio
`index.html`; al extraerlos a archivos independientes esa sangría
quedó "flotando" sin motivo. Es un cambio puramente cosmético — se
confirmó con `git diff -w` (que ignora espacios) que no hay ninguna
diferencia funcional, y se volvió a correr la verificación con
Playwright por las dudas.

### `.gitignore`

**Qué:** se agregó un `.gitignore` con entradas típicas de SO
(`.DS_Store`, `Thumbs.db`), editores (`.vscode/`, `.idea/`) y
tooling futuro (`node_modules/`, `.env`).

**Por qué:** aunque el proyecto hoy no tiene build ni dependencias,
es la convención estándar tenerlo desde el principio para no
terminar commiteando basura de sistema operativo o editor por
accidente si en algún momento se agrega tooling (por ejemplo, un
build de Tailwind — ver más abajo).

## Sobre la URL de Google Apps Script hardcodeada en `commons.js`

**Qué se planteó:** sacar la URL del endpoint de Google Apps Script
(`SCRIPT_URL`) del código versionado, usando un secret de GitHub
Actions.

**Por qué no se hizo (todavía):** esa URL no es una credencial en el
sentido clásico — el propio navegador de cada visitante tiene que
poder llamarla para guardar su confirmación de asistencia, así que
por diseño **tiene que ser visible/ejecutable del lado del cliente**.
Sacarla del repo no la oculta del sitio publicado (sigue estando en
el "Ver código fuente" de la página en vivo); solo evitaría que quede
en el historial de git. Migrarla a un secret de GitHub Actions
requeriría además cambiar cómo se despliega el sitio (de "GitHub
Pages sirve la rama tal cual" a "deploy vía Actions con un paso de
build"), una complejidad extra para un beneficio de seguridad real
limitado. La seguridad de ese endpoint depende de cómo esté
configurado el propio Apps Script del lado de Google (permisos de
ejecución, validación del payload), no de dónde vive la URL en el
repo. Queda pendiente de decisión.

## Pendiente de decisión: build de producción de Tailwind

**Qué se planteó:** reemplazar el script `cdn.tailwindcss.com` por un
CSS de Tailwind compilado y purgado.

**Por qué no se hizo (todavía):** el CDN de Tailwind está pensado
para desarrollo/prototipado — no está optimizado para producción y
tira un warning en consola — pero cambiarlo implica correr un build
(al menos una vez) y decidir si el proyecto va a mantener tooling de
Node de ahí en más, o si alcanza con generar el CSS una sola vez y
commitear el resultado. Queda pendiente de decisión.
