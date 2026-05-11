# Landing DJ (`landing-dj`)

Landing web de **K1D T0M1** (DJ y productor), construida con React + Vite, con una experiencia visual inmersiva y un chat IA integrado mediante Cloudflare Worker.

Este README documenta:
- la estructura y funcionamiento del frontend (`Landing_DJ`)
- la integracion con el backend de chat (`worker_chat_api_portfolios`)

---

## 1) Stack tecnico

### Frontend (`Landing_DJ`)
- `React 19` + `Vite 8`
- `TailwindCSS`
- `GSAP` (animaciones)
- `Lenis` (scroll suave)
- `Vitest` + `Testing Library` (tests de UI/utilidades)

### Chat API (`worker_chat_api_portfolios`)
- `Cloudflare Workers` con `wrangler`
- Integracion con Gemini API (`generateContent`)
- CORS habilitado para consumo desde la landing

---

## 2) Estructura principal del frontend

Ruta base: `src/`

- `App.jsx`: compone la experiencia principal y monta secciones.
- `components/DJChat.jsx`: widget flotante de chat IA + accesos a WhatsApp/Email.
- `sections/*`: bloques de la landing (`Intro`, `About`, `DJVisuals`, `Sets`, `Contact`).
- `data/sets.js`: catalogo de sets usado tanto en UI como en contexto para IA.
- `data/socials.js`: redes sociales mostradas en UI y pasadas al contexto del chat.
- `lib/lenis.jsx`: provider/control de scroll.
- `styles/globals.css`: estilos globales.

---

## 3) Flujo de integracion del chat

1. El usuario abre el panel en `DJChat`.
2. Al enviar mensaje, el frontend hace `POST` a `VITE_CHAT_API_URL`.
3. Se envia payload con:
   - `source` (`dj_landing`)
   - `locale` (`es`)
   - `messages` (historial user/assistant)
   - `context` enriquecido (identidad DJ, booking, sets, redes y links)
4. El worker construye un `system prompt` con tono/rol DJ y contexto serializado.
5. El worker llama a Gemini y devuelve `{ reply }`.
6. El frontend pinta la respuesta en el hilo.

Notas importantes:
- Si `VITE_CHAT_API_URL` no existe, el chat entra en modo fallback y sugiere WhatsApp/Email.
- El componente normaliza URL para apuntar a `/chat` cuando solo llega dominio raiz.
- Se parsean links en texto de respuesta para volverlos clicables en UI.

---

## 4) Configuracion local del frontend

En la raiz del landing:

```bash
npm install
```

Crear `.env` (o copiar desde `.env.example`) con:

```env
VITE_CHAT_API_URL=https://<tu-worker>.workers.dev/chat
```

Ejecutar:

```bash
npm run dev
```

Scripts disponibles:
- `npm run dev`: servidor local Vite.
- `npm run build`: build de produccion.
- `npm run preview`: preview local del build.
- `npm run test`: suite de tests en modo run.
- `npm run test:watch`: tests en modo interactivo.

---

## 5) Chat API (repo externo)

Repo analizado: `D:\Escritorio_Compartido\APPS\worker_chat_api_portfolios`

### Endpoints expuestos
- `POST /chat` (principal)
- `GET /chat` (health informativo)
- `GET /health` (health informativo)
- `OPTIONS *` (preflight CORS)

### Variables del worker

Requerida:
- `GEMINI_API_KEY`

Opcionales (con defaults):
- `GEMINI_API_BASE_URL` (default: `https://generativelanguage.googleapis.com/v1beta`)
- `GEMINI_MODEL` (default: `gemini-3-flash-preview`)

### Scripts del worker
- `npm run dev` -> `wrangler dev`
- `npm run deploy` -> `wrangler deploy`
- `npm run check` -> validacion sintactica (`node --check`)

### Contrato de request (desde landing)

```json
{
  "source": "dj_landing",
  "locale": "es",
  "messages": [
    { "role": "user", "content": "Quiero contratarte para..." }
  ],
  "context": {
    "site": "dj",
    "identity": {},
    "booking": {},
    "sets": [],
    "socials": [],
    "links": {}
  }
}
```

### Contrato de response

Success:

```json
{ "reply": "..." }
```

Errores posibles:
- `missing_api_key` (500)
- `empty_reply` (502)
- `bad_provider_request` (400)
- `provider_auth_failed` (502)
- `provider_model_not_found` (502)
- `provider_rate_limited` (429)
- `chat_failed` (500)

---

## 6) Comportamientos funcionales relevantes

### Chat UX
- Widget flotante doble CTA (`Chat IA` + `WhatsApp`).
- Modal con cierre por backdrop, boton y tecla `Escape`.
- Estado online/offline segun disponibilidad de `VITE_CHAT_API_URL`.
- Prompts iniciales para acelerar consultas frecuentes.
- CTA de salida a WhatsApp/Email con resumen automatico de los ultimos mensajes.

### Contacto (seccion `Contact`)
- Form local con validacion cliente.
- Copia de email al portapapeles con fallback a `mailto:`.
- Estado visual de envio (`sent`) y copia (`copied`).

---

## 7) Calidad y testing

Hay cobertura de tests en componentes y utilidades clave:
- componentes visuales/interactivos (`Cursor`, `Lightbox`, `MagneticButton`, `Marquee`, etc.)
- utilidades (`magnetic-math`, `format-counter`)
- hooks/logica de secciones (`useIntroGate`, validacion de contacto)

Ejecutar:

```bash
npm run test
```

---

## 8) Deploy y entornos

### Frontend
- Build con `npm run build`.
- Publicacion recomendada en Cloudflare Pages o plataforma equivalente para SPA Vite.

### Worker
- Deploy con `npm run deploy` en `worker_chat_api_portfolios`.
- Configurar secreto en produccion:

```bash
npx wrangler secret put GEMINI_API_KEY
```

### Conexion entre ambos
- El frontend debe apuntar a URL publica del worker:

```env
VITE_CHAT_API_URL=https://worker-portfolio-oficial.<tu-subdominio>.workers.dev/chat
```

---

## 9) Troubleshooting rapido

### El chat muestra "IA OFFLINE"
- Revisar que `VITE_CHAT_API_URL` este definida en `.env`.
- Verificar reinicio de `npm run dev` tras cambiar variables.

### El worker responde error de auth/proveedor
- Validar `GEMINI_API_KEY` en entorno local o secrets de Wrangler.
- Confirmar que `GEMINI_MODEL` exista en la cuenta/proveedor.

### CORS o fallo de red
- Confirmar que el frontend apunte al endpoint correcto (`/chat`).
- Revisar si la URL configurada tiene protocolo `https://`.

---

## 10) Mejoras recomendadas (backlog)

- Persistencia de conversaciones (hoy todo es efimero en cliente).
- Rate limiting y abuse protection en el worker.
- Observabilidad (logs estructurados, trazas, metricas de latencia/error).
- Versionado explicito del contrato API y validacion de payload de entrada.
- Test de integracion E2E entre landing y worker.

---

## 11) Referencias internas

- Frontend chat: `src/components/DJChat.jsx`
- Entrada app: `src/App.jsx`
- Config Vite/Test: `vite.config.js`
- Worker API: `D:\Escritorio_Compartido\APPS\worker_chat_api_portfolios\src\index.js`
- Worker config: `D:\Escritorio_Compartido\APPS\worker_chat_api_portfolios\wrangler.jsonc`

