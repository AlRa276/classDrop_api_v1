# Archivos

## Listar archivos publicados
- Método: `GET`
- Ruta: `/api/archivos/publicados`
- Descripción: Devuelve los archivos publicados. Puede filtrarse por `materiaId` y paginarse con `limite` y `offset`.
- Auth: no
- Query params:
  - `materiaId` (opcional)
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

## Eliminar archivo
- Método: `DELETE`
- Ruta: `/api/archivos/:id`
- Descripción: Elimina un archivo creado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
