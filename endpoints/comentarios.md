# Comentarios

## Listar comentarios por archivo
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

## Crear comentario
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

## Eliminar comentario
- Método: `DELETE`
- Ruta: `/api/v1/comentarios/:id`
- Descripción: Marca un comentario como eliminado. Solo puede hacerlo el autor.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
