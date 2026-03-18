# Documentación de servicios – Travel Platform (backend)

Este documento describe los servicios del backend, sus endpoints y los cambios relevantes. Se irá actualizando conforme se agreguen o modifiquen servicios.

**Backend:** Encore.ts · **Base de datos:** PostgreSQL (`backend/db`)

---

## Índice

1. [Auth](#1-auth)
2. [User](#2-user)
3. [Próximos servicios](#3-próximos-servicios)

---

## 1. Auth

**Carpeta:** `backend/auth`  
**Descripción:** Login, JWT, logout y cambio de contraseña. Integrado con el `authHandler` de Encore para proteger endpoints.

### Autenticación (Gateway)

- El **auth handler** (`auth.ts`) valida el header `Authorization: Bearer <token>` y devuelve `AuthData` (userID, email, role_id).
- Los endpoints con `auth: true` exigen token válido; si no lo hay o es inválido, Encore responde `401 Unauthorized`.

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login con email y contraseña. Devuelve token JWT y datos del usuario. |
| POST | `/auth/logout` | Sí | Cierre de sesión. El cliente debe desechar el token. Respuesta: `{ "ok": true }`. |
| POST | `/auth/change-password` | Sí | Cambia la contraseña del usuario autenticado. |

### Detalle por endpoint

#### POST `/auth/login` (público)

**Request (body):**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "name": "Nombre",
    "role_id": 2
  }
}
```

- Contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número (validado con Zod).

#### POST `/auth/logout` (protegido)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "ok": true }`
- No se mantiene blacklist de tokens; la invalidación real es por expiración del JWT (7 días) o al desechar el token en el cliente.

#### POST `/auth/change-password` (protegido)

**Request (body):**

```json
{
  "currentPassword": "contraseñaActual",
  "newPassword": "NuevaPassword123"
}
```

**Response:** `{ "ok": true }`

- Reglas de `newPassword`: mismas que en registro (8+ caracteres, mayúscula, minúscula, número).
- Si `currentPassword` no coincide, responde `401 unauthenticated`.

### Cambios documentados (Auth)

- **Login y JWT:** Login con email/password, generación de JWT (expiración 7 días), verificación de token en el auth handler.
- **Validación en endpoints protegidos:** Cualquier API con `auth: true` pasa por el auth handler y obtiene `AuthData` vía `getAuthData()`.
- **Logout:** Endpoint POST `/auth/logout` con `auth: true`; el cliente debe eliminar el token.
- **Cambio de contraseña:** Endpoint POST `/auth/change-password` con `auth: true`, validación de contraseña actual y nueva con Zod.

---

## 2. User

**Carpeta:** `backend/user`  
**Descripción:** Registro público, listado y perfil de usuarios. Inclusión de invitación con rol (solo admins pueden crear admins).

### Roles

- `role_id = 1` → admin  
- `role_id = 2` → user (viajero; valor por defecto en registro)

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/users` | No | Registro público. Crea usuario con rol **user** (role_id 2). |
| POST | `/users/invite` | Sí | Crear usuario con rol indicado. Solo **admins** pueden usar `role_id = 1`. |
| GET | `/users` | No | Listado paginado de usuarios (query: `page`, `limit`). |
| GET | `/users/me` | Sí | Perfil del usuario autenticado. |
| GET | `/users/:id` | No | Usuario por ID. |
| GET | `/users/email/:email` | No | Usuario por email. |

### Detalle por endpoint

#### POST `/users` (público – registro)

**Request (body):**

```json
{
  "email": "nuevo@ejemplo.com",
  "name": "Nombre Completo",
  "password": "Password123"
}
```

- Siempre crea usuarios con `role_id = 2` (user). No acepta `role_id` en el body.

#### POST `/users/invite` (protegido)

**Request (body):**

```json
{
  "email": "admin@ejemplo.com",
  "name": "Admin",
  "password": "Password123",
  "role_id": 1
}
```

- `role_id` opcional; por defecto `2` (user). Valores permitidos: `1` (admin), `2` (user).
- Si `role_id === 1`, el llamador debe ser admin (`getAuthData().role_id === 1`). Si no, responde `403 permission_denied` ("Only admins can create admin users").

#### GET `/users/me` (protegido)

- **Headers:** `Authorization: Bearer <token>`
- Devuelve el perfil del usuario asociado al token (sin contraseña).

### Cambios documentados (User)

- **Registro público:** POST `/users` sin auth, siempre con rol user.
- **Invitación con rol:** POST `/users/invite` con `auth: true`, acepta `role_id` opcional.
- **Solo admins crean admins:** Si en `/users/invite` se envía `role_id = 1`, solo un usuario con `role_id = 1` puede llamar al endpoint; en caso contrario se devuelve `403`.

---

## 3. Próximos servicios

Se irán documentando aquí según el diseño del proyecto (`todoList.ts`):

- **Blog:** CMS (posts, comentarios), CRUD admin, lectura pública.
- **Booking:** Viajes, reservas, asientos, tickets.
- **Payments:** Pagos, estados, integración con bookings.

Para agregar un nuevo servicio o cambio en este documento:

1. Añadir una sección con título `## N. Nombre del servicio`.
2. Incluir tabla de endpoints, método, ruta, auth y descripción.
3. Opcional: ejemplos de request/response y subsección **Cambios documentados** con la fecha o versión si se desea.
