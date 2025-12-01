# Servicio de Autenticación

Este servicio proporciona autenticación de usuarios usando JWT (JSON Web Tokens) integrado con Encore.ts.

## Configuración

### 1. Instalar dependencias

```bash
cd backend
npm install jsonwebtoken @types/jsonwebtoken
```

### 2. Regenerar tipos de Encore

Después de crear el auth handler, ejecuta Encore para que regenere los tipos de autenticación:

```bash
encore run
```

Esto regenerará los tipos en `encore.gen/auth/` y `encore.gen/internal/auth/` con el tipo `AuthData` correcto.

### 3. Configurar el secreto JWT

Debes configurar el secreto JWT como un secret de Encore:

**Opción 1: Usando CLI**
```bash
encore secret set --type local JWTSecret
# Ingresa tu secreto cuando se solicite
```

**Opción 2: Usando archivo local (solo desarrollo)**
Crea un archivo `.secrets.local.cue` en la raíz del backend:
```cue
JWTSecret: "tu-secreto-super-seguro-aqui"
```

**⚠️ Importante:** El secreto debe ser una cadena segura y aleatoria. Para generar uno:
```bash
openssl rand -base64 32
```

**Opción 3: Usando el dashboard de Encore Cloud**
1. Ve a https://app.encore.cloud
2. Navega a Settings > Secrets
3. Crea el secret `JWTSecret` para cada ambiente

## Uso

### Endpoint de Login

**POST** `/auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "MiPassword123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role_id": 2
  }
}
```

### Proteger Endpoints

Para proteger un endpoint y requerir autenticación, agrega `auth: true` en las opciones del API:

```typescript
import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export const myProtectedEndpoint = api(
    { method: "GET", path: "/protected", expose: true, auth: true },
    async (): Promise<{ message: string }> => {
        // Obtener datos del usuario autenticado
        const authData = getAuthData();
        
        return {
            message: `Hola usuario ${authData.email} (ID: ${authData.userID})`
        };
    }
);
```

### Acceder a datos de autenticación

En cualquier endpoint protegido, puedes acceder a los datos del usuario autenticado:

```typescript
import { getAuthData } from "~encore/auth";

const authData = getAuthData();
// authData.userID - ID del usuario
// authData.email - Email del usuario
// authData.role_id - ID del rol del usuario
```

### Usar el token en requests

Cuando hagas requests a endpoints protegidos, incluye el token en el header `Authorization`:

```bash
curl -X GET http://localhost:4000/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Estructura del Servicio

- **`auth.types.ts`**: Define los tipos TypeScript para autenticación
- **`auth.service.ts`**: Contiene la lógica de negocio (login, verificación de tokens)
- **`auth.ts`**: Implementa el `authHandler` y configura el `Gateway` de Encore
- **`auth.endpoints.ts`**: Define los endpoints públicos de autenticación

## Seguridad

- Las contraseñas se hashean usando bcrypt con 10 salt rounds
- Los tokens JWT expiran después de 7 días
- El secreto JWT debe ser fuerte y mantenerse seguro
- Los tokens se validan en cada request a endpoints protegidos

