# FCM Token

## Actualizar FCM Token
- Método: `PUT`
- Ruta: `/api/v1/auth/fcm-token`
- Descripción: Actualiza el token de Firebase Cloud Messaging (FCM) del usuario autenticado. Se puede llamar cada vez que el usuario inicia sesión o cuando recibe un nuevo token en la app.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "fmcToken": "token-fcm-de-firebase-cloud-messaging"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-usuario",
    "fmcToken": "token-fcm-de-firebase-cloud-messaging",
    "mensaje": "Token FCM actualizado correctamente"
  },
  "meta": null,
  "error": null
}
```

## Integración con Login (Opcional)

El endpoint de login también acepta el parámetro `fmcToken` en el body para actualizar directamente durante la autenticación:

### Login con FCM Token (Alternativa)
- Método: `POST`
- Ruta: `/api/v1/auth/login`
- Body:
```json
{
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseña",
  "fmcToken": "token-fcm-opcional"
}
```

### Dos opciones de flujo recomendadas:

**Opción 1: Endpoint independiente (Recomendado)**
1. Usuario hace login: `POST /api/v1/auth/login` (sin fmcToken)
2. Recibe el token de autenticación
3. Luego llama: `PUT /api/v1/auth/fcm-token` con su FCM token actual
- **Ventaja**: No afecta la conexión del login, permite actualizar el token en cualquier momento

**Opción 2: Integrado en login**
1. Usuario hace login: `POST /api/v1/auth/login` (con fmcToken)
2. Se autentica y actualiza el FCM token en una sola llamada
- **Ventaja**: Una sola llamada al iniciar sesión

**Recomendación**: Usar la Opción 1 (endpoint independiente) para:
- Desacoplar la lógica de autenticación
- Permitir actualizar el token después del login (ej: cuando llega uno nuevo de FCM)
- Mayor flexibilidad y mantenimiento

## Notas
- El FCM token debe almacenarse en la app cliente cuando se recibe de Firebase
- Si el usuario recibe un nuevo token de FCM (rotación automática), debe actualizar el servidor
- El campo `fmcToken` es opcional en el login pero recomendado enviarlo en `PUT /fcm-token`
- Se requiere autenticación válida (JWT token) para usar este endpoint
