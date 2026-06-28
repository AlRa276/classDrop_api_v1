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

## Registro de administrador
- Método: `POST`
- Ruta: `/api/auth/registro-admin`
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

## Perfil
- Método: `GET`
- Ruta: `/api/auth/perfil`
- Descripción: Obtiene los datos del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Logout
- Método: `POST`
- Ruta: `/api/auth/logout`
- Descripción: Cierra la sesión del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
