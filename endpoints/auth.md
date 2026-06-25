# Auth

## Registro de usuario
- Método: `POST`
- Ruta: `/api/auth/registro`
- Descripción: Registra un nuevo usuario con correo institucional y contraseña.
- Body:
```json
{
  "nombreCompleto": "Nombre Usuario",
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseñaSegura"
}
```

## Login
- Método: `POST`
- Ruta: `/api/auth/login`
- Descripción: Autentica al usuario y devuelve un token JWT.
- Body:
```json
{
  "correo": "usuario@upchiapas.edu.mx",
  "contrasena": "contraseñaSegura"
}
```

## Perfil (pendiente de activar)
- Método: `GET`
- Ruta: `/api/auth/perfil`
- Descripción: Obtiene los datos del usuario autenticado.
- Headers:
  - `Authorization: Bearer <token>`
