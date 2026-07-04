# Dislikes en Archivos

## Dar dislike a un archivo
- Método: `POST`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Registra un dislike para un archivo. Si el usuario tenía un like previo en ese archivo, se elimina (mutuamente excluyentes).
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

## Quitar dislike de un archivo
- Método: `DELETE`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Elimina el dislike del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.

## Nota sobre contadores
- Los contadores `totalLikes`, `totalDislikes`, `totalDescargas` y `totalComentarios` ya vienen incluidos
  directamente en cada archivo devuelto por `GET /api/v1/archivos/publicados`, `GET /api/v1/archivos/me`
  y `GET /api/v1/archivos/:id`. No es necesario pedirlos por separado.