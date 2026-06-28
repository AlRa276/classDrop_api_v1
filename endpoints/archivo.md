# Archivos

## Listar archivos publicados
- Método: `GET`
- Ruta: `/api/archivos/publicados`
- Descripción: Devuelve los archivos publicados. Puede filtrarse por `materiaId`, buscar por texto y paginarse con `limite` y `offset`.
- Auth: no
- Query params:
  - `materiaId` (opcional)
  - `search` (opcional)
  - `orden` (opcional)
  - `limite` (opcional)
  - `offset` (opcional)

## Contar archivos publicados por usuario
- Método: `GET`
- Ruta: `/api/archivos/publicados/contador`
- Descripción: Devuelve el total de archivos publicados por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Listar mis archivos
- Método: `GET`
- Ruta: `/api/archivos/mis-archivos`
- Descripción: Devuelve los archivos creados por el usuario autenticado, pudiendo filtrar por estado y paginar.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Query params:
  - `estado` (opcional)
  - `limite` (opcional)
  - `offset` (opcional)

## Obtener archivo por id
- Método: `GET`
- Ruta: `/api/archivos/:id`
- Descripción: Consulta los datos de un archivo específico, incluyendo materia, autor y adjuntos.
- Auth: no

## Crear archivo
- Método: `POST`
- Ruta: `/api/archivos`
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

## Actualizar estado de archivo
- Método: `PATCH`
- Ruta: `/api/archivos/:id/estado`
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

## Eliminar archivo
- Método: `DELETE`
- Ruta: `/api/archivos/:id`
- Descripción: Elimina un archivo creado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
