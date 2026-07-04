

## Auth

### Registro de usuario
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
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "field": "correo", "issue": "El correo ya está registrado" }
    ]
  }
}
```

### Registro de administrador
- Método: `POST`
- Ruta: `/api/v1/auth/registro-admin`
- Descripción: Registra un nuevo usuario con rol de administrador.
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
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "El correo debe ser institucional (@upchiapas.edu.mx)" }
    ]
  }
}
```

### Login
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
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Credenciales inválidas" }
    ]
  }
}
```

### Perfil
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
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Logout
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
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

## Archivos

### Listar archivos publicados
- Método: `GET`
- Ruta: `/api/v1/archivos/publicados`
- Descripción: Devuelve los archivos publicados. Puede filtrarse por `materiaId`, buscar por texto y paginarse.
- Auth: no
- Query params:
  - `materiaId` (opcional)
  - `search` (opcional)
  - `orden` (opcional, valores: `recientes`, `antiguos`)
  - `limite` (opcional)
  - `offset` (opcional)
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "count": 42,
    "rows": [
      {
        "id": "uuid-del-archivo",
        "titulo": "Apuntes de Arquitectura de Software",
        "descripcion": "Resumen y ejercicios resueltos",
        "tipo": "pdf",
        "estado": "publicado",
        "subidoPor": "uuid-del-usuario",
        "materiaId": "uuid-de-la-materia",
        "totalLikes": 10,
        "totalDislikes": 1,
        "totalDescargas": 120,
        "totalComentarios": 8,
        "creado_en": "2026-07-02T12:34:56.000Z",
        "autor": {
          "id": "uuid-del-usuario",
          "nombreCompleto": "Nombre Usuario"
        },
        "materia": {
          "id": "uuid-de-la-materia",
          "nombre": "Arquitectura de Software"
        }
      }
    ]
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Parámetro limite debe ser un número entero" }
    ]
  }
}
```

### Contar archivos publicados por usuario
- Método: `GET`
- Ruta: `/api/v1/archivos/publicados/contador`
- Descripción: Devuelve el total de archivos publicados por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 12
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Listar mis archivos
- Método: `GET`
- Ruta: `/api/v1/archivos/me`
- Descripción: Devuelve los archivos creados por el usuario autenticado, con filtros opcionales.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Query params:
  - `estado` (opcional)
  - `limite` (opcional)
  - `offset` (opcional)
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "count": 7,
    "rows": [
      {
        "id": "uuid-del-archivo",
        "titulo": "Apuntes de Arquitectura de Software",
        "descripcion": "Resumen y ejercicios resueltos",
        "tipo": "pdf",
        "estado": "pendiente",
        "materiaId": "uuid-de-la-materia",
        "totalLikes": 0,
        "totalDislikes": 0,
        "totalDescargas": 0,
        "totalComentarios": 0,
        "creado_en": "2026-07-02T12:34:56.000Z",
        "materia": {
          "id": "uuid-de-la-materia",
          "nombre": "Arquitectura de Software"
        }
      }
    ]
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Obtener archivo por id
- Método: `GET`
- Ruta: `/api/v1/archivos/:id`
- Descripción: Consulta los datos de un archivo específico, incluyendo materia, autor y adjuntos.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-archivo",
    "titulo": "Apuntes de Arquitectura de Software",
    "descripcion": "Resumen y ejercicios resueltos",
    "tipo": "pdf",
    "estado": "publicado",
    "subidoPor": "uuid-del-usuario",
    "materiaId": "uuid-de-la-materia",
    "totalLikes": 10,
    "totalDislikes": 1,
    "totalDescargas": 120,
    "totalComentarios": 8,
    "publicadoEn": "2026-07-02T12:34:56.000Z",
    "motivoRechazo": null,
    "creado_en": "2026-07-02T10:00:00.000Z",
    "autor": {
      "id": "uuid-del-usuario",
      "nombreCompleto": "Nombre Usuario"
    },
    "materia": {
      "id": "uuid-de-la-materia",
      "nombre": "Arquitectura de Software",
      "cuatrimestreId": "uuid-del-cuatrimestre"
    },
    "adjuntos": [
      {
        "id": "uuid-del-adjunto",
        "urlStorage": "https://storage.example.com/archivo.pdf",
        "nombreOriginal": "apuntes.pdf",
        "tipoMime": "application/pdf",
        "tamanoBytes": 1200000,
        "numPaginas": 45,
        "orden": 0
      }
    ]
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Archivo no encontrado" }
    ]
  }
}
```

### Crear archivo
- Método: `POST`
- Ruta: `/api/v1/archivos`
- Descripción: Crea un nuevo archivo pendiente. Requiere usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "titulo": "Apuntes de Arquitectura de Software",
  "descripcion": "Resumen y ejercicios resueltos",
  "tipo": "pdf",
  "materiaId": "uuid-de-la-materia",
  "adjuntos": [
    {
      "urlStorage": "https://storage.example.com/archivo.pdf",
      "nombreOriginal": "apuntes.pdf",
      "tipoMime": "application/pdf",
      "tamanoBytes": 1200000,
      "numPaginas": 45
    }
  ]
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-archivo",
    "titulo": "Apuntes de Arquitectura de Software",
    "descripcion": "Resumen y ejercicios resueltos",
    "tipo": "pdf",
    "estado": "pendiente",
    "subidoPor": "uuid-del-usuario",
    "materiaId": "uuid-de-la-materia",
    "publicadoEn": null,
    "motivoRechazo": null,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Debe completar título, materia, usuario y adjuntar al menos un archivo" }
    ]
  }
}
```

### Actualizar estado de archivo
- Método: `PATCH`
- Ruta: `/api/v1/archivos/:id/estado`
- Descripción: Cambia el estado de un archivo. Solo usuarios administradores pueden ejecutar esta acción.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token-admin>`
- Body:
```json
{
  "estado": "publicado"
}
```

Ejemplo para rechazar:
```json
{
  "estado": "rechazado",
  "motivoRechazo": "El archivo no cumple con las normas de la plataforma"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-archivo",
    "estado": "publicado",
    "publicadoEn": "2026-07-02T13:00:00.000Z",
    "motivoRechazo": null
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Estado de archivo inválido" }
    ]
  }
}
```

### Eliminar archivo
- Método: `DELETE`
- Ruta: `/api/v1/archivos/:id`
- Descripción: Elimina un archivo creado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`403 Forbidden`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "403",
    "message": "FORBIDDEN",
    "details": [
      { "issue": "No tienes permiso para eliminar este archivo" }
    ]
  }
}
```

## Comentarios

### Listar comentarios por archivo
- Método: `GET`
- Ruta: `/api/v1/comentarios/archivo/:id`
- Descripción: Obtiene todos los comentarios activos de un archivo.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-comentario",
      "contenido": "Texto del comentario",
      "archivoId": "uuid-del-archivo",
      "usuarioId": "uuid-del-usuario",
      "eliminado": false,
      "creado_en": "2026-07-02T12:34:56.000Z",
      "autor": {
        "id": "uuid-del-usuario",
        "nombreCompleto": "Nombre Usuario",
        "avatarUrl": null
      }
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Archivo no encontrado" }
    ]
  }
}
```

### Crear comentario
- Método: `POST`
- Ruta: `/api/v1/comentarios`
- Descripción: Crea un comentario nuevo en un archivo. El usuario debe estar autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "contenido": "Texto del comentario"
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-comentario",
    "contenido": "Texto del comentario",
    "archivoId": "uuid-del-archivo",
    "usuarioId": "uuid-del-usuario",
    "eliminado": false,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`422 Unprocessable Entity`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "422",
    "message": "UNPROCESSABLE_ENTITY",
    "details": [
      { "issue": "El comentario contiene contenido prohibido o spam" }
    ]
  }
}
```

### Eliminar comentario
- Método: `DELETE`
- Ruta: `/api/v1/comentarios/:id`
- Descripción: Marca un comentario como eliminado. Solo puede hacerlo el autor.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`403 Forbidden`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "403",
    "message": "FORBIDDEN",
    "details": [
      { "issue": "No tienes permiso para eliminar este comentario" }
    ]
  }
}
```

## Cuatrimestres

### Listar cuatrimestres
- Método: `GET`
- Ruta: `/api/v1/cuatrimestres`
- Descripción: Obtiene la lista de cuatrimestres precargados.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-cuatrimestre",
      "nombre": "Primer Cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Cuatrimestre no encontrado" }
    ]
  }
}
```

### Obtener cuatrimestre por id
- Método: `GET`
- Ruta: `/api/v1/cuatrimestres/:id`
- Descripción: Obtiene un cuatrimestre por su identificador.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-cuatrimestre",
    "nombre": "Primer Cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Cuatrimestre no encontrado" }
    ]
  }
}
```

## Descargas

### Registrar descarga
- Método: `POST`
- Ruta: `/api/v1/descargas`
- Descripción: Registra la descarga de un archivo por un usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "adjuntoId": "uuid-del-adjunto-opcional"
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-descarga",
    "archivoId": "uuid-del-archivo",
    "adjuntoId": "uuid-del-adjunto-opcional",
    "usuarioId": "uuid-del-usuario",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Archivo no disponible para descarga" }
    ]
  }
}
```

### Listar descargas del usuario
- Método: `GET`
- Ruta: `/api/v1/descargas/usuario`
- Descripción: Devuelve las descargas realizadas por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-descarga",
      "archivoId": "uuid-del-archivo",
      "adjuntoId": "uuid-del-adjunto-opcional",
      "usuarioId": "uuid-del-usuario",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Contar descargas del usuario
- Método: `GET`
- Ruta: `/api/v1/descargas/usuario/contador`
- Descripción: Devuelve el total de descargas realizadas por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 27
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Listar descargas por archivo
- Método: `GET`
- Ruta: `/api/v1/descargas/archivo/:id`
- Descripción: Devuelve las descargas registradas para un archivo específico.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-descarga",
      "archivoId": "uuid-del-archivo",
      "adjuntoId": "uuid-del-adjunto-opcional",
      "usuarioId": "uuid-del-usuario",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Archivo no encontrado" }
    ]
  }
}
```

## Dislikes en Archivos

### Dar dislike a un archivo
- Método: `POST`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Registra un dislike para un archivo. Si el usuario tenía un like previo en ese archivo, se elimina.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-dislike",
    "usuarioId": "uuid-del-usuario",
    "archivoId": "uuid-del-archivo",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Ya has dado dislike a este archivo" }
    ]
  }
}
```

### Quitar dislike de un archivo
- Método: `DELETE`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Elimina el dislike del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "No existe dislike para eliminar" }
    ]
  }
}
```

## Guardados

### Guardar archivo
- Método: `POST`
- Ruta: `/api/v1/guardados/:archivoId`
- Descripción: Guarda un archivo en la lista de favoritos del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-guardado",
    "usuarioId": "uuid-del-usuario",
    "archivoId": "uuid-del-archivo",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Archivo ya guardado" }
    ]
  }
}
```

### Quitar archivo guardado
- Método: `DELETE`
- Ruta: `/api/v1/guardados/:archivoId`
- Descripción: Elimina un archivo guardado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Guardado no encontrado" }
    ]
  }
}
```

### Listar archivos guardados por usuario
- Método: `GET`
- Ruta: `/api/v1/guardados/usuario`
- Descripción: Devuelve los archivos guardados por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-guardado",
      "archivoId": "uuid-del-archivo",
      "usuarioId": "uuid-del-usuario",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Contar archivos guardados por usuario
- Método: `GET`
- Ruta: `/api/v1/guardados/usuario/contador`
- Descripción: Devuelve el total de archivos guardados por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 7
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

## Likes en Archivos

### Dar like a un archivo
- Método: `POST`
- Ruta: `/api/v1/likes/archivos/:archivoId`
- Descripción: Registra un like para un archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-like",
    "usuarioId": "uuid-del-usuario",
    "archivoId": "uuid-del-archivo",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Ya has dado like a este archivo" }
    ]
  }
}
```

### Quitar like de un archivo
- Método: `DELETE`
- Ruta: `/api/v1/likes/archivos/:archivoId`
- Descripción: Elimina el like del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "No existe like para eliminar" }
    ]
  }
}
```

## Likes en Comentarios

### Dar like a un comentario
- Método: `POST`
- Ruta: `/api/v1/likes/comentarios/:comentarioId`
- Descripción: Registra un like a un comentario. Usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-like",
    "usuarioId": "uuid-del-usuario",
    "comentarioId": "uuid-del-comentario",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Ya has dado like a este comentario" }
    ]
  }
}
```

### Quitar like de un comentario
- Método: `DELETE`
- Ruta: `/api/v1/likes/comentarios/:comentarioId`
- Descripción: Elimina el like de un comentario por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "No existe like para eliminar" }
    ]
  }
}
```

## Materias

### Listar todas las materias
- Método: `GET`
- Ruta: `/api/v1/materias`
- Descripción: Devuelve todas las materias activas.
- Query params:
  - `search` (opcional)
  - `limit` (opcional)
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-materia",
      "nombre": "Arquitectura de Software",
      "icono": "📘",
      "cuatrimestreId": "uuid-del-cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Parámetro limit debe ser un número entero" }
    ]
  }
}
```

### Listar materias por cuatrimestre
- Método: `GET`
- Ruta: `/api/v1/materias/cuatrimestre/:id`
- Descripción: Devuelve las materias de un cuatrimestre específico.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-materia",
      "nombre": "Arquitectura de Software",
      "icono": "📘",
      "cuatrimestreId": "uuid-del-cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Cuatrimestre no encontrado" }
    ]
  }
}
```

### Obtener materia por id
- Método: `GET`
- Ruta: `/api/v1/materias/:id`
- Descripción: Devuelve los datos de una materia específica.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Materia no encontrada" }
    ]
  }
}
```

### Crear materia
- Método: `POST`
- Ruta: `/api/v1/materias`
- Descripción: Crea una nueva materia.
- Body:
```json
{
  "nombre": "Arquitectura de Software",
  "icono": "📘",
  "cuatrimestreId": "uuid-del-cuatrimestre"
}
```
- Auth: sí (admin)
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Ya existe una materia con ese nombre en ese cuatrimestre" }
    ]
  }
}
```

### Actualizar materia
- Método: `PUT`
- Ruta: `/api/v1/materias/:id`
- Descripción: Actualiza los datos de una materia existente.
- Body: cualquier combinación de `nombre`, `icono`, `cuatrimestreId`, `activo`.
- Auth: sí (admin)
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Materia no encontrada" }
    ]
  }
}
```

### Eliminar materia
- Método: `DELETE`
- Ruta: `/api/v1/materias/:id`
- Descripción: Elimina (baja lógica) una materia.
- Auth: sí (admin)
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Materia no encontrada" }
    ]
  }
}
```

## Moderación IA

### Registrar moderación IA
- Método: `POST`
- Ruta: `/api/v1/moderaciones`
- Descripción: Crea un registro de moderación de IA para un archivo. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "motivoFlag": "Contenido posiblemente inapropiado",
  "aprobado": false
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-moderacion",
    "archivoId": "uuid-del-archivo",
    "motivoFlag": "Contenido posiblemente inapropiado",
    "aprobado": false,
    "revisadoPor": "uuid-del-admin",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Debe indicar el archivo moderado" }
    ]
  }
}
```

### Listar moderaciones por archivo
- Método: `GET`
- Ruta: `/api/v1/moderaciones/archivo/:id`
- Descripción: Devuelve las moderaciones de IA asociadas a un archivo. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-moderacion",
      "archivoId": "uuid-del-archivo",
      "motivoFlag": "Contenido posiblemente inapropiado",
      "aprobado": false,
      "revisadoPor": "uuid-del-admin",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

## Normas

### Crear norma
- Método: `POST`
- Ruta: `/api/v1/normas`
- Descripción: Crea una nueva norma o guía en la plataforma. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "titulo": "Reglas de uso",
  "descripcion": "Normas para compartir archivos."
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-norma",
    "titulo": "Reglas de uso",
    "descripcion": "Normas para compartir archivos.",
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`401 Unauthorized`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "401",
    "message": "UNAUTHORIZED",
    "details": [
      { "issue": "Se requiere autenticación para acceder a este recurso." }
    ]
  }
}
```

### Listar normas
- Método: `GET`
- Ruta: `/api/v1/normas`
- Descripción: Devuelve todas las normas.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-norma",
      "titulo": "Reglas de uso",
      "descripcion": "Normas para compartir archivos.",
      "activo": true,
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Norma no encontrada" }
    ]
  }
}
```

### Actualizar norma
- Método: `PUT`
- Ruta: `/api/v1/normas/:id`
- Descripción: Actualiza una norma existente. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "titulo": "Normas actualizadas",
  "descripcion": "Contenido actualizado de la norma."
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-norma",
    "titulo": "Normas actualizadas",
    "descripcion": "Contenido actualizado de la norma.",
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Norma no encontrada" }
    ]
  }
}
```

### Eliminar norma
- Método: `DELETE`
- Ruta: `/api/v1/normas/:id`
- Descripción: Elimina una norma. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
- Ejemplo de error (`404 Not Found`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "404",
    "message": "NOT_FOUND",
    "details": [
      { "issue": "Norma no encontrada" }
    ]
  }
}
```

## Reportes

### Crear reporte
- Método: `POST`
- Ruta: `/api/v1/reportes`
- Descripción: Reporta un archivo o comentario en la plataforma.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "tipoContenido": "archivo",
  "archivoId": "uuid-del-archivo",
  "puntuacion": 4
}
```

O:
```json
{
  "tipoContenido": "comentario",
  "comentarioId": "uuid-del-comentario",
  "puntuacion": 3
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-reporte",
    "reportadoPor": "uuid-del-usuario",
    "tipoContenido": "archivo",
    "archivoId": "uuid-del-archivo",
    "comentarioId": null,
    "puntuacion": 4,
    "estado": "pendiente",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`409 Conflict`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "409",
    "message": "CONFLICT",
    "details": [
      { "issue": "Ya has reportado este contenido" }
    ]
  }
}
```

### Listar reportes pendientes
- Método: `GET`
- Ruta: `/api/v1/reportes/pendientes`
- Descripción: Obtiene los reportes pendientes. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-reporte",
      "reportadoPor": "uuid-del-usuario",
      "tipoContenido": "archivo",
      "archivoId": "uuid-del-archivo",
      "comentarioId": null,
      "puntuacion": 4,
      "estado": "pendiente",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`403 Forbidden`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "403",
    "message": "FORBIDDEN",
    "details": [
      { "issue": "No tienes permiso para ver los reportes pendientes" }
    ]
  }
}
```

### Resolver reporte
- Método: `PUT`
- Ruta: `/api/v1/reportes/:id/resolver`
- Descripción: Cambia el estado del reporte a `resuelto` o `descartado`. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "estado": "resuelto",
  "accionTomada": "Se eliminó el contenido tras verificación"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-reporte",
    "estado": "resuelto",
    "resueltoPor": "uuid-del-admin",
    "accionTomada": "Se eliminó el contenido tras verificación",
    "resuelto_en": "2026-07-02T13:00:00.000Z"
  },
  "meta": null,
  "error": null
}
```
- Ejemplo de error (`400 Bad Request`):
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "400",
    "message": "BAD_REQUEST",
    "details": [
      { "issue": "Estado de reporte inválido" }
    ]
  }
}
```
