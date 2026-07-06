# FCM Token

## Actualizar FCM Token durante Login
- Método: `POST`
- Ruta: `/api/v1/auth/login`
- Descripción: Autentica al usuario e incia sesión con su token FCM de Firebase Cloud Messaging.
- Auth: no
- Body:
```json
{
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseña",
  "fmcToken": "token-fcm-de-firebase-cloud-messaging"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-para-autenticacion",
    "usuario": {
      "id": "uuid-del-usuario",
      "nombreCompleto": "Nombre del Usuario",
      "correo": "usuario@upchiapas.edu.mx",
      "rol": "estudiante"
    }
  },
  "meta": null,
  "error": null
}
```

## Flujo de integración

### Flujo recomendado en el frontend:

1. **Obtener token FCM de Firebase** (cuando la app se inicia)
   ```javascript
   // En Firebase Cloud Messaging (FCM)
   const fmcToken = await messaging.getToken();
   ```

2. **Enviar login con FCM token**
   ```javascript
   POST /api/v1/auth/login
   {
     "correo": "usuario@upchiapas.edu.mx",
     "contrasena": "contraseña",
     "fmcToken": fmcToken
   }
   ```

3. **Guardar el JWT token recibido**
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

## Notas
- El parámetro `fmcToken` es **opcional** en el login
- Si no se envía `fmcToken`, el login funciona normalmente sin guardar notificaciones
- El FCM token debe obtenerse de Firebase Cloud Messaging en el cliente
- Si el usuario recibe un nuevo token FCM después del login (rotación automática), puede hacer logout y login nuevamente con el nuevo token
- Se requiere el campo `correo` y `contrasena` para autenticarse

