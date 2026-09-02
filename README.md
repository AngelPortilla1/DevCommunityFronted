# DevCommunity — Frontend

> Frontend Angular 17+ de la plataforma **DevCommunity**: red social para desarrolladores con feed de posts, mensajería en tiempo real, sesiones técnicas y más.

## Arquitectura

![Arquitectura DevCommunity Frontend](docs/architecture.svg)

> 🔍 **[Ver diagrama interactivo completo →](docs/architecture.html)** *(pan, zoom, vistas por capas, dark/light mode)*

### Capas principales

| Capa | Descripción |
|------|-------------|
| **Routing** | `Angular Router` con lazy-loading. `AuthGuard` protege todas las rutas privadas. |
| **Auth** | `AuthService` inicializa la sesión en `APP_INITIALIZER`. `JwtInterceptor` adjunta el Bearer token automáticamente en cada petición HTTP. |
| **Feature Pages** | `Feed`, `Explore`, `Sessions`, `Messages`, `Notifications`, `Saved`, `Profile`, `Trending` — todas con lazy-loading bajo `MainLayout`. |
| **Core Services** | `ApiService` centraliza las peticiones HTTP. `MessageService` (WebSocket + chat), `NotificationService`, `SavedService` lo extienden. |

---

## Stack

- **Framework**: Angular 17+ (Standalone Components, Signals)
- **Routing**: Angular Router con lazy-loading
- **Auth**: JWT + `HTTP_INTERCEPTORS`
- **Testing**: Vitest

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve
# → http://localhost:4200
```

## Build

```bash
ng build
```

Los artefactos se generan en `dist/`.

## Tests

```bash
ng test   # unit tests (Vitest)
ng e2e    # end-to-end
```

---

## Documentación

| Archivo | Descripción |
|---------|-------------|
| [`docs/architecture.html`](docs/architecture.html) | Diagrama interactivo (Archify) con pan/zoom y vistas |
| [`docs/architecture.svg`](docs/architecture.svg) | SVG estático para embeber en documentos |

---

*Generado con [Archify](https://github.com/tt-a1i/archify) v2.17*
