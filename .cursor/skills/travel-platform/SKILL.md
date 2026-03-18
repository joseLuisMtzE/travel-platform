---
name: travel-platform
description: Guía de estructura, convenciones y servicios del proyecto Travel Platform (Encore.ts). Usar al implementar o modificar backend (auth, blog, booking, payments), crear endpoints, migraciones o integrar nuevos servicios.
---

# Travel Platform – Desarrollo

## Dónde está cada cosa

- **Backend (Encore.ts)**: `backend/` — servicios, APIs, BD.
- **Reglas Encore/TypeScript**: `backend/.cursor/rules/corey-travel-platform-rules.mdc` — APIs, auth, DB, migraciones.
- **Lista de tareas / design**: `todoList.ts` (raíz) — fases, servicios pendientes y endpoints.

Cada **servicio** vive en su propia carpeta bajo `backend/` con `encore.service.ts` y endpoints en archivos como `*.endpoints.ts` o `*.ts`.

## Estructura actual del backend

```
backend/
├── encore.app
├── auth/          # Login, registro, JWT, roles (viajero, admin)
├── user/          # Perfil/datos de usuario
├── db/             # SQLDatabase "travel_platform", migraciones en ./migrations
└── .cursor/rules/  # Reglas detalladas Encore.ts
```

## Convenciones rápidas

1. **Endpoints**: `api()` de `encore.dev/api` con `method`, `path`, `expose`, `auth` según necesidad. Tipar request/response con interfaces.
2. **Validación**: Usar Zod en el handler y lanzar `APIError.invalidArgument()` si falla.
3. **Base de datos**: Importar `db` desde `backend/db/database.ts`. Migraciones en `backend/db/migrations/`.
4. **Auth**: Endpoints protegidos con `auth: true`; usar datos del usuario desde el contexto de Encore cuando haga falta.

## Servicios planeados (todoList.ts)

- **auth** ✅ — login, registro, JWT, roles.
- **blog** — CMS (posts, comentarios), CRUD admin, lectura pública.
- **booking** — viajes, reservas, asientos, tickets.
- **payments** — CLEAN architecture, estados de pago, integración con bookings.

Al agregar un servicio nuevo: crear carpeta bajo `backend/`, añadir `encore.service.ts`, y opcionalmente `db/migrations` si se necesitan tablas.

## Flujo para desarrollo fluido

1. Consultar `todoList.ts` para ver qué está pendiente por fase/servicio.
2. Seguir patrones de `backend/auth/` (endpoints, validación, uso de `db`).
3. Para detalles de sintaxis Encore (api, auth, SQL, migraciones), usar las reglas en `backend/.cursor/rules/`.
