// TODO: Travel Platform - Lista de Tareas
// Basado en el Design Doc del proyecto

// ============================================
// FASE 1 - INFRAESTRUCTURA BÁSICA
// ============================================
// ✅ Setup de proyecto con Encore.ts
// ✅ Creación de servicio `auth` (login/registro)
// ✅ Setup BD Postgres y conexión desde Encore
// ✅ Autenticación con JWT implementada
// ✅ Roles básicos (viajero, admin)
// TODO: Completar migraciones de base de datos
// TODO: Agregar seeds para datos de prueba

// ============================================
// SERVICIO: AUTH
// ============================================
// ✅ Login y verificación de tokens JWT
// ✅ Registro de usuarios
// ✅ Gestión de roles (viajero/admin)
// ✅ Validación de token en endpoints protegidos (auth: true + authHandler)
// ✅ Endpoint de logout (POST /auth/logout; cliente desecha token)
// TODO: Implementar refresh tokens (opcional, no crítico)
// ✅ Endpoint para cambiar contraseña (POST /auth/change-password, auth)
// ✅ Solo admins pueden crear admins (POST /users/invite con role_id; solo admin si role_id=1)

// ============================================
// FASE 2 - BLOG CMS (Destinos y tips de viaje)
// ============================================
// TODO: Crear servicio `blog` en Encore.ts
// TODO: Crear tabla `posts` en base de datos
// TODO: Crear tabla `comments` en base de datos
// TODO: Implementar CRUD de posts (solo admin)
// TODO: Implementar lectura de posts (público/autenticado)
// TODO: Implementar sistema de comentarios
// TODO: Agregar relación posts -> users (author_id)
// TODO: Agregar relación comments -> posts y users
// TODO: Endpoint: GET /blog/posts (listar con paginación)
// TODO: Endpoint: GET /blog/posts/:id (detalle de post)
// TODO: Endpoint: POST /blog/posts (crear, solo admin)
// TODO: Endpoint: PUT /blog/posts/:id (actualizar, solo admin)
// TODO: Endpoint: DELETE /blog/posts/:id (eliminar, solo admin)
// TODO: Endpoint: POST /blog/posts/:id/comments (crear comentario)
// TODO: Endpoint: GET /blog/posts/:id/comments (listar comentarios)

// ============================================
// FASE 3 - BOOKING SYSTEM
// ============================================
// TODO: Crear servicio `booking` en Encore.ts
// TODO: Crear tabla `trips` en base de datos
// TODO: Crear tabla `bookings` en base de datos
// TODO: Definir modelo de viaje (origen, destino, fecha, precio, asientos disponibles)
// TODO: Implementar CRUD de viajes (solo admin)
// TODO: Implementar sistema de reservas
// TODO: Control de disponibilidad de asientos
// TODO: Asignación de asientos (textual, no visual)
// TODO: Confirmación de reserva y generación de ticket
// TODO: Endpoint: GET /booking/trips (listar viajes disponibles)
// TODO: Endpoint: GET /booking/trips/:id (detalle de viaje)
// TODO: Endpoint: POST /booking/trips (crear viaje, solo admin)
// TODO: Endpoint: PUT /booking/trips/:id (actualizar viaje, solo admin)
// TODO: Endpoint: DELETE /booking/trips/:id (eliminar viaje, solo admin)
// TODO: Endpoint: POST /booking/trips/:id/reserve (crear reserva)
// TODO: Endpoint: GET /booking/my-bookings (mis reservas, autenticado)
// TODO: Endpoint: GET /booking/bookings/:id (detalle de reserva/ticket)
// TODO: Validar que no se puedan reservar más asientos de los disponibles

// ============================================
// SERVICIO: PAYMENTS (CLEAN Architecture)
// ============================================
// TODO: Crear servicio `payments` en Encore.ts
// TODO: Crear tabla `payments` en base de datos
// TODO: Implementar arquitectura CLEAN para diferentes formas de pago
// TODO: Definir interfaces para métodos de pago (simulados)
// TODO: Implementar estados de pago (pendiente, procesando, completado, fallido, reembolsado)
// TODO: Integrar payments con bookings
// TODO: Endpoint: POST /payments/process (procesar pago simulado)
// TODO: Endpoint: GET /payments/:id (estado del pago)
// TODO: Simular diferentes métodos de pago (tarjeta, efectivo, transferencia)
// TODO: Manejar transiciones de estado de pago

// ============================================
// FASE 4 - TRIP TRACKING (Trabajo futuro)
// ============================================
// TODO: Crear servicio `trip` en Encore.ts
// TODO: Crear tabla `tracking` en base de datos
// TODO: Implementar estados de viaje (programado, en curso, retrasado, completado)
// TODO: Implementar Pub/Sub para actualizaciones en tiempo real
// TODO: Simular tracking de posición (lat, lng) con datos generados
// TODO: Endpoint: GET /trip/trips/:id/status (estado actual del viaje)
// TODO: Endpoint: GET /trip/trips/:id/tracking (posición actual simulada)
// TODO: Implementar actualizaciones periódicas de posición (simuladas)
// TODO: Notificar cambios de estado del viaje

// ============================================
// FASE 5 - NOTIFICACIONES (Trabajo futuro)
// ============================================
// TODO: Crear servicio `notification` en Encore.ts
// TODO: Integrar con bookings para confirmaciones
// TODO: Integrar con trips para avisos de retraso/cancelación
// TODO: Simular envío de emails (no real, solo logging)
// TODO: Simular push notifications (no real, solo eventos)
// TODO: Endpoint: GET /notifications/my-notifications (mis notificaciones)
// TODO: Implementar templates de notificaciones

// ============================================
// FRONTEND - WEB APP (React - Mobile First)
// ============================================
// TODO: Setup proyecto React con TypeScript
// TODO: Configurar routing (React Router)
// TODO: Implementar página de login/registro
// TODO: Implementar autenticación en frontend (JWT storage)
// TODO: Crear página de exploración de artículos/blog
// TODO: Crear página de detalle de artículo con comentarios
// TODO: Crear página de búsqueda de viajes
// TODO: Crear página de detalle de viaje
// TODO: Implementar flujo de reserva de boletos
// TODO: Crear página de mis reservas
// TODO: Crear página de detalle de ticket
// TODO: Implementar tracking en tiempo real del viaje (Fase 4)
// TODO: Diseño mobile-first responsive

// ============================================
// FRONTEND - DASHBOARD ADMIN (React)
// ============================================
// TODO: Setup proyecto React Dashboard con TypeScript
// TODO: Implementar autenticación admin
// TODO: Crear panel de gestión de artículos (CRUD)
// TODO: Crear panel de gestión de viajes (CRUD)
// TODO: Crear panel de visualización de reservas
// TODO: Crear panel de gestión de comentarios (moderación opcional)
// TODO: Implementar validación de rol admin en frontend

// ============================================
// MEJORAS TÉCNICAS Y DOCUMENTACIÓN
// ============================================
// TODO: Agregar logging estructurado en servicios
// TODO: Agregar validación de entrada robusta (Zod)
// TODO: Implementar manejo de errores consistente
// TODO: Agregar documentación de API (README por servicio)
// TODO: Crear README principal con setup y arquitectura
// TODO: Agregar diagramas de arquitectura
// TODO: Documentar flujos principales (reserva, tracking)
// TODO: Agregar tests básicos de endpoints críticos

// ============================================
// BASE DE DATOS
// ============================================
// ✅ Tabla users con roles
// TODO: Migración para tabla posts
// TODO: Migración para tabla comments
// TODO: Migración para tabla trips
// TODO: Migración para tabla bookings
// TODO: Migración para tabla payments
// TODO: Migración para tabla tracking
// TODO: Agregar índices para mejorar queries
// TODO: Agregar foreign keys y constraints
// TODO: Crear seeds para datos de prueba

// ============================================
// NO INCLUIR (Non-Goals del Design Doc)
// ============================================
// ❌ Pagos reales (Stripe, Mercado Pago) - Solo simulación
// ❌ Tracking con GPS real o APIs externas - Solo simulación
// ❌ Push notifications reales (FCM, APNs) - Solo simulación
// ❌ Roles complejos o jerarquías - Solo viajero y admin
// ❌ Internacionalización (i18n) - Solo español
// ❌ Multimoneda - Solo una moneda (MXN o USD)
// ❌ Diseño avanzado o temas personalizados - Enfoque funcional
// ❌ Optimización para grandes volúmenes - Priorizar claridad
// ❌ Rate limiting avanzado - Solo básico si es necesario
// ❌ Control de asientos visual (mapa) - Solo textual
// ❌ Tests automatizados extensivos - Solo básicos
