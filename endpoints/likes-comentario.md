# Likes en Comentarios

## Dar like a un comentario
- Método: `POST`
- Ruta: `/api/likes-comentario/:comentarioId`
- Descripción: Registra un like a un comentario. Usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Quitar like de un comentario
- Método: `DELETE`
- Ruta: `/api/likes-comentario/:comentarioId`
- Descripción: Elimina el like de un comentario por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
