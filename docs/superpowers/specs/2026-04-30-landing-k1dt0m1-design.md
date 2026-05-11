# Landing K1D T0M1 — Design Spec

**Fecha:** 2026-04-30
**Marca:** K1D T0M1 — Techno · Urban · Producer
**Tagline:** "Más que música, una experiencia"
**Tipo:** Landing portfolio/booking artista DJ
**Stack:** React 18 + Vite + JSX (sin TypeScript) + Tailwind CSS + GSAP + Lenis

---

## 1. Objetivos

- Presentar la identidad K1D T0M1 con una intro cinematográfica que establezca tono techno/urbano.
- Mostrar bio, mixes, galería y vías de booking en un flujo continuo y altamente animado.
- Dar prioridad a impacto visual y experiencia (cursor custom, scroll smooth, glitch, scanlines, reveals con scrub, marquees diagonales).
- Mantener accesibilidad: respetar `prefers-reduced-motion`, controles teclado, contraste suficiente.

## 2. Stack

| Capa | Tecnología |
|------|------------|
| Build | Vite (template `react`, no TS) |
| UI | React 18 + JSX |
| Estilos | Tailwind CSS + variables CSS para tokens |
| Animación | GSAP 3 (core) + ScrollTrigger + SplitText (o Splitting.js si SplitText no disponible — fallback) |
| Smooth scroll | Lenis (`@studio-freight/lenis`) |
| Iconos | `lucide-react` (mínimo, solo donde haga falta) |
| Tipografía | Sweet Sucker Punch (display, local `.otf` → `.woff2`) + Space Grotesk (body, Google Fonts) |

**Por qué:** GSAP estándar para timelines complejas + ScrollTrigger para scrub. Lenis = smooth scroll moderno con interop ScrollTrigger. JSX sin TS por preferencia explícita del usuario. Tailwind = velocidad iteración + utility para detalles, complementado con CSS modules/global para animaciones complejas.

## 3. Identidad Visual

### Paleta (Techno cyber)

```css
--color-bg: #0a0a0c;          /* near black */
--color-fg: #f5f5f7;          /* off white */
--color-cyan: #00f0ff;        /* neon primary */
--color-magenta: #ff00d4;     /* neon secondary */
--color-grid: rgba(245,245,247,0.08);
--color-glow-cyan: 0 0 24px rgba(0,240,255,0.6);
--color-glow-magenta: 0 0 24px rgba(255,0,212,0.6);
```

### Tipografía

- **Display:** Sweet Sucker Punch — headlines hero, números contador, "READY TO EXPERIENCE THE BEAT?"
- **Body / UI / Mono-tech:** Space Grotesk — bio, labels, navegación, BPM/MIN labels
- **Numerals contador:** Space Grotesk Bold tabular-nums (alineación) o Sweet Sucker Punch si se ve bien

### Efectos globales

- Scanlines overlay opacity 0.06
- Grain noise SVG turbulence sutil
- Glow neón en hovers + flashes intro
- Cursor custom (3 modos: default, hover, glitch)

## 4. Estructura del proyecto

```
landing-dj/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── fonts/SweetSuckerPunch.woff2
│   ├── images/portrait/{1..9}.png
│   └── logo.svg
├── docs/superpowers/specs/        ← este spec
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── lib/
    │   ├── gsap.js                ← registerPlugin, defaults
    │   ├── lenis.jsx              ← LenisProvider + hook lock/unlock
    │   └── useIntroGate.js        ← global flag intro complete
    ├── components/
    │   ├── Cursor.jsx
    │   ├── MagneticButton.jsx
    │   ├── Marquee.jsx
    │   ├── SectionCurtain.jsx
    │   ├── RevealImage.jsx
    │   ├── Scanlines.jsx
    │   └── Lightbox.jsx
    ├── sections/
    │   ├── Intro/
    │   │   ├── Intro.jsx
    │   │   ├── Counter.jsx
    │   │   ├── DiagonalMarquees.jsx
    │   │   └── LogoStroke.jsx
    │   ├── About.jsx
    │   ├── Sets.jsx
    │   ├── Gallery.jsx
    │   └── Contact.jsx
    ├── data/
    │   ├── sets.js                ← {id, title, bpm, duration, soundcloudUrl}
    │   ├── gallery.js             ← {src, span, alt}
    │   └── socials.js
    └── styles/
        ├── globals.css
        └── tokens.css
```

## 5. Sistema de animación

### 5.1 Inicialización

```js
// src/lib/gsap.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });
export { gsap, ScrollTrigger };
```

### 5.2 Lenis ↔ ScrollTrigger interop

```js
// src/lib/lenis.jsx
- LenisProvider crea instancia Lenis global
- raf loop -> ScrollTrigger.update on lenis.on('scroll')
- Expose context: { lenis, lock(), unlock() }
- Lock durante intro hero, unlock cuando intro termine
```

### 5.3 Gate de scroll

`useIntroGate` exporta `{ ready, setReady }`. Lenis arranca lockeado. `Intro.jsx` llama `setReady(true)` al terminar timeline. Demás secciones registran ScrollTriggers solo después de `ready`.

## 6. Hero / Intro (timeline detallado)

**Duración total:** ~4.5s

```
t=0.0s  Black screen
        Scanlines overlay fade in 0.3s
        DiagonalMarquees inicia auto-scroll (suave, blur 4px)

t=0.3s  Counter mount center-bottom (Sweet Sucker Punch)
        Tween numérico 0 → 100 con duración 2.7s, ease power2.inOut
        Cada ~6 frames: chance 8% de glitch char (símbolo random) por 80ms
        Glow alterna cyan/magenta cada 0.4s

t=3.0s  Counter llega 100
        FlashWhite 80ms (overlay div opacity 0→1→0)
        RGB split aplicado a contenedor: filter url(#glitch) durante 200ms

t=3.2s  Counter desvanece + scale 1.4
        LogoStroke timeline empieza
          - 7 letras (K, 1, D, T, 0, M, 1) con stagger 0.08s
          - cada letra: stroke-dashoffset N → 0 en 0.6s, ease cubic-bezier(0.5,0,0.5,1)
          - blur(2px) → blur(0) sincronizado
          - filter glow neón cyan al final
        DiagonalMarquees blur 4px → 0px (foco final)

t=4.3s  Logo full revealed
        Subtle flicker neón (3 ticks opacidad)
        Tagline "MÁS QUE MÚSICA · UNA EXPERIENCIA" SplitText fade-up stagger 0.04s
        Scroll hint "SCROLL ↓" pulso vertical loop infinito

t=4.5s  setReady(true) → Lenis unlock → ScrollTriggers activos
```

### Layout hero post-intro

- Logo centrado verticalmente, ~75% ancho a la izquierda
- DiagonalMarquees ocupa ~25% derecha, full height
  - Marquee #1: rota -22° aproximadamente, dirección descendente, contenido `K1D T0M1 ★ TECHNO ★ URBAN ★ PRODUCER ★` repetido
  - Marquee #2: rota +22° aprox, dirección ascendente, contenido `MORE THAN MUSIC ★ AN EXPERIENCE ★ LIVE THE BEAT ★`
  - Velocidad ~60s loop, font-size grande, opacity 0.7, letter-spacing tight
  - `transform-origin` y `width` calibrados para cubrir bien el strip diagonal sin huecos

### LogoStroke construcción

SVG custom con paths stroke-only para "K1D T0M1":
- viewBox amplio (~600x100)
- Cada glifo como `<path>` con `stroke-dasharray={length}` y `stroke-dashoffset={length}` inicial
- Fuente: trazar manualmente con tipografía o construir desde geométrica simple. Recomendación: usar Sweet Sucker Punch como base + extraer paths con tool (FontForge / Glyphr Studio) → simplificar a strokes únicos por glifo.
- Alternativa simplificada (acordada en brainstorming opción A): geometría manual estilo monoespacio futurista, líneas + curvas, similar al MuchStroke ref.
- 3 grupos repetidos como animationLogo.html original (efecto trail), opacity 0.2, 0.2, 1 con animation-delay 0, 0.33, 0.67s.

## 7. Secciones

### 7.1 About / Bio

**Layout:**
- Header `01 / ABOUT` arriba izquierda (Space Grotesk uppercase tracking-wide)
- Grid 2 columnas: portrait (col 1) + texto (col 2)
- Stats row inline abajo: `05 YRS | 120+ SETS | 30 TRACKS | EU TOUR`

**Animaciones:**
- Header `01 / ABOUT` SplitText reveal stagger 0.04s al entrar viewport (start: top 80%)
- Portrait `RevealImage`: clip-path inset(100% 0 0 0) → inset(0) scrub 0.5
- Bio párrafos SplitText fade-up stagger 0.02s
- Stats: cada número tween 0→N con `useCounter` hook ScrollTrigger once, duración 1.5s
- Botones IG / SoundCloud: `MagneticButton` (extra 3), translate hacia cursor con elasticidad

**Imagen:** `1.png` o la que mejor encuadre vertical.

### 7.2 Sets / Mixes

**Layout:**
- Header `02 / SETS`
- Lista vertical 5 filas grandes (datos `data/sets.js`), separadores línea 1px

**Fila tipo:**
```
#001  RAW WAREHOUSE             128 BPM · 60 MIN          ▶ PLAY
```

**Animaciones:**
- Cursor entra sección → muta a `glitch` (extra 7): SVG filter feTurbulence + feDisplacementMap animado + RGB split
- Cada fila reveal stagger ScrollTrigger
- Bordes 1px dibujan stroke (clip-path width 0→100%) al entrar
- Hover fila: bg subtle magenta tint + scanline barre horizontal (animación clip-path) + scale text 1.02
- Click `▶ PLAY`: row expande → SoundCloud iframe lazy mount + autoplay
- Solo una fila expandida a la vez, click otra colapsa la previa

**Datos `sets.js`:**
```js
export const sets = [
  { id: '001', title: 'RAW WAREHOUSE', bpm: 128, duration: 60, soundcloudUrl: '...' },
  { id: '002', title: 'URBAN PULSE', bpm: 132, duration: 45, soundcloudUrl: '...' },
  ...
];
```

### 7.3 Gallery

**Layout:**
- Header `03 / GALLERY`
- Grid CSS asimétrico (12 columnas, span manual por imagen)
- 8 imágenes (`2.png` - `9.png`)

**Spans propuesto:**
```
img2 col-span-3  row-span-2
img3 col-span-5  row-span-2
img4 col-span-4  row-span-2
img5 col-span-5  row-span-2
img6 col-span-3  row-span-2
img7 col-span-4  row-span-2
img8 col-span-3  row-span-2
img9 col-span-5  row-span-2
```

(ajustable; 2 imágenes por fila promedio, alturas variadas vía aspect-ratio)

**Animaciones:**
- Cada imagen `RevealImage`: clip-path scrub
- Parallax y-translate por imagen, velocidades alternas (-20px / +20px / -10px) ScrollTrigger scrub
- Hover: scale 1.03, overlay magenta 20% + label `00X / 008` esquina top-right
- Click: abre `Lightbox` global modal (overlay fixed, fade in 0.3s, close ESC o click backdrop)

### 7.4 Contact / Booking

**Layout:**
- Header `04 / BOOKING`
- Headline gigante 3 líneas Sweet Sucker Punch:
  ```
  READY TO
  EXPERIENCE
  THE BEAT?
  ```
- Email CTA `booking@k1dt0m1.com →`
- Socials row inline: IG · SC · SPOTIFY · YT · TIKTOK
- Foto retrato a la derecha (sticky o decorativa, opcional)
- Form: campos `name`, `email`, `event type`, `message`, botón `SEND →`

**Animaciones:**
- Headline palabras stagger reveal scroll (SplitText words)
- Email click: copia clipboard, toast "COPIED" 1.5s
- Email es `MagneticButton` (extra 3)
- Socials hover: underline draw left→right (clip-path o scaleX origin-left)
- Form inputs underline focus animado, label flota up al focus/typing
- Submit: validación cliente simple (name no vacío, email regex) → POST a placeholder endpoint (`/api/booking` mock o mailto fallback). Sin backend real en este scope; mostrar success state animado.

## 8. Globales

### 8.1 Cursor (`Cursor.jsx`)

- Div fixed top-left, tracked via `mousemove` con `gsap.quickTo` para lerp.
- Modos:
  - `default`: círculo 12px outline cyan
  - `hover`: escala 2.5x, fill cyan, mix-blend difference
  - `glitch`: filtro SVG turbulence (extra 7), aplicado en sección Sets
- Trigger por evento data-cursor en elementos: `<a data-cursor="hover">`
- Mobile: hidden (touch detection).

### 8.2 SectionCurtain (`SectionCurtain.jsx`)

- Panel negro full-width entre secciones, ScrollTrigger pin corto.
- ClipPath `inset(0)` a `inset(100% 0 0 0)` durante pin (50vh distancia scroll).
- Da pausa visual + sensación de cambio de "acto".

### 8.3 Scanlines (`Scanlines.jsx`)

- Div fixed inset-0 pointer-events-none z-[60]
- Background repeating-linear-gradient horizontal 2px, opacity 0.06
- Animación opcional `translateY` muy lenta loop infinito 8s.

### 8.4 Marquee (`Marquee.jsx`)

- Reusable. Props: `text`, `direction='up'|'down'|'left'|'right'`, `speed`, `rotate`.
- Implementación: 2 spans contenido duplicados, `gsap.to` infinite x/y `linear` ease.
- Usado en: DiagonalMarquees (intro/hero) + opcional banner inter-secciones.

### 8.5 RevealImage (`RevealImage.jsx`)

- Wrapper div con `overflow:hidden`. Imagen interior.
- ScrollTrigger scrub: clip-path inset(100% 0 0 0) → inset(0).
- Variantes prop: direction=`top|left|bottom|right`.

### 8.6 MagneticButton (`MagneticButton.jsx`)

- Listener mousemove en parent. Calcula offset cursor vs centro.
- gsap.to el child translate con strength prop (default 0.4).
- mouseleave: translate 0 ease elastic.

### 8.7 Lightbox (`Lightbox.jsx`)

- Portal a `document.body`. Backdrop blur + dark.
- Imagen centrada full max 90vw 90vh, padding.
- Cerrar: ESC, click backdrop, botón X esquina.
- Navegación: arrows ← → entre imágenes gallery (opcional).
- Animación entrada: fade backdrop + scale imagen 0.9 → 1.

## 9. Datos y contenido

### 9.1 `data/sets.js`

5 sets de ejemplo (placeholders editables por usuario).

### 9.2 `data/gallery.js`

Array de 8 fotos de `Recursos/2.png ... 9.png`, con span/alt.

### 9.3 `data/socials.js`

Links sociales placeholder (Instagram, SoundCloud, Spotify, YouTube, TikTok).

### 9.4 Texto bio

Placeholder editable. Usuario podrá editarlo después en `About.jsx`.

## 10. Accesibilidad

- `prefers-reduced-motion`:
  - Skipea intro counter (logo aparece directo opacidad fade-in 0.3s).
  - Desactiva DiagonalMarquees (estáticas o ocultas).
  - Desactiva parallax y scrub de RevealImage (clip-path snap).
  - Desactiva cursor glitch (queda default).
- Focus styles visibles (outline cyan 2px) en todos botones/links/inputs.
- Alt text en todas imágenes.
- Form labels asociados a inputs.
- Contraste WCAG AA: cyan #00f0ff sobre #0a0a0c → ratio >7:1 ✓

## 11. Performance

- Lazy load fotos gallery: `loading="lazy"` + IntersectionObserver para iniciar animaciones solo en viewport.
- SoundCloud iframes: solo montar al click PLAY (no embebidos por defecto).
- Fonts: `font-display: swap`, preload Sweet Sucker Punch en `<head>`.
- GSAP timelines killed en cleanup `useEffect` cada componente.
- Imágenes portrait: convertir a WebP previo a deploy (script o manual).

## 12. Responsive

**Breakpoints:**
- `sm` <640: stack vertical en hero (logo arriba, marquees ocultos o 1 horizontal abajo). About 1 columna. Sets row simplifica. Gallery 2 columnas.
- `md` 640-1024: hero comprimido, marquees diagonales mantienen pero menores. Gallery 2-3 cols.
- `lg` >1024: layout completo descrito arriba.

## 13. Out of scope (no incluido)

- Backend real para form (mock/placeholder).
- CMS / panel admin.
- i18n (todo español + inglés en headlines, sin sistema multi-idioma).
- SEO meta tags avanzados (solo título/desc básico).
- Analytics.
- Integración real APIs SoundCloud/Spotify (solo embeds y links).

## 14. Criterios de éxito

- Intro hero corre fluido a 60fps en desktop moderno.
- Lenis smooth scroll integrado correctamente con ScrollTrigger (no jumpy).
- Cada sección anima al entrar viewport sin saltos.
- Cursor custom funciona y muta correctamente entre modos.
- Form valida cliente y muestra success/error state.
- `prefers-reduced-motion` respetado (intro saltada, sin auto-marquees).
- Build Vite produce bundle <500KB JS comprimido.

## 15. Plan de implementación (alto nivel)

1. Scaffold Vite React + Tailwind + Lenis + GSAP, fonts setup.
2. Tokens, estilos globales, cursor, scanlines.
3. Lenis provider + intro gate.
4. Hero: Counter + DiagonalMarquees + LogoStroke + timeline orquestada.
5. About sección con RevealImage + stats counter.
6. Sets sección con cursor glitch + filas expandibles + iframe SC.
7. Gallery grid + parallax + Lightbox.
8. Contact headline + form + social links + magnetic CTA.
9. SectionCurtain entre secciones.
10. Reduced motion + responsive polish.
11. Build + smoke test producción.

(Plan detallado se materializa en próximo paso con `writing-plans`.)
