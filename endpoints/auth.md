# Auth

## Registro de usuario
- Método: `POST`
- Ruta: `/api/v1/auth/registro`
- Descripción: Registra un nuevo usuario con correo institucional y contraseña.
- Body:
```json
{
  "nombreCompleto": "Nombre Usuario",
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseñaSegura"
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombreCompleto": "Nombre Usuario",
    "correo": "usuario@upchiapas.edu.mx"
  },
  "meta": null,
  "error": null
}
```

## Registro de administrador
- Método: `POST`
- Ruta: `/api/v1/auth/registro-admin`
- Descripción: Registra un nuevo usuario con rol de administrador.
- Auth: no
- Body:
```json
{
  "nombreCompleto": "Admin Usuario",
  "correo": "admin@upchiapas.edu.mx",
  "contrasena": "contraseñaSegura"
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "nombreCompleto": "Admin Usuario",
    "correo": "admin@upchiapas.edu.mx",
    "rol": "admin"
  },
  "meta": null,
  "error": null
}
```

## Login
- Método: `POST`
- Ruta: `/api/v1/auth/login`
- Descripción: Autentica al usuario y devuelve un token JWT.
- Body:
```json
{
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseñaSegura"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombreCompleto": "Nombre Usuario",
      "correo": "usuario@upchiapas.edu.mx",
      "rol": "user"
    }
  },
  "meta": null,
  "error": null
}
```

## Perfil
- Método: `GET`
- Ruta: `/api/v1/auth/perfil`
- Descripción: Obtiene los datos del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombreCompleto": "Nombre Usuario",
    "correo": "usuario@upchiapas.edu.mx",
    "rol": "user",
    "avatarUrl": null
  },
  "meta": null,
  "error": null
}
```

## Logout
- Método: `POST`
- Ruta: `/api/v1/auth/logout`
- Descripción: Cierra la sesión del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "mensaje": "Sesión cerrada correctamente"
  },
  "meta": null,
  "error": null
}
```
