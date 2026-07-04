# Likes en Comentarios

## Dar like a un comentario
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

## Quitar like de un comentario
- Método: `DELETE`
- Ruta: `/api/v1/likes/comentarios/:comentarioId`
- Descripción: Elimina el like de un comentario por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
