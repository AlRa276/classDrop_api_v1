# Archivos

## Listar archivos publicados
- Método: `GET`
- Ruta: `/api/v1/archivos/publicados`
- Descripción: Devuelve los archivos publicados. Puede filtrarse por `materiaId`, buscar por texto y paginarse con `limite` y `offset`.
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

## Contar archivos publicados por usuario
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

## Listar mis archivos
- Método: `GET`
- Ruta: `/api/v1/archivos/me`
- Descripción: Devuelve los archivos creados por el usuario autenticado, pudiendo filtrar por estado y paginar.
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

## Obtener archivo por id
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

## Crear archivo
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

## Actualizar estado de archivo
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

## Eliminar archivo
- Método: `DELETE`
- Ruta: `/api/v1/archivos/:id`
- Descripción: Elimina un archivo creado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
