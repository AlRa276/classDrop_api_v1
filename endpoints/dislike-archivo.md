# Dislikes en Archivos

## Dar dislike a un archivo
- Método: `POST`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Registra un dislike para un archivo. Si el usuario tenía un like previo en ese archivo, se elimina (mutuamente excluyentes).
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Quitar dislike de un archivo
- Método: `DELETE`
- Ruta: `/api/v1/dislikes/archivos/:archivoId`
- Descripción: Elimina el dislike del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Nota sobre contadores
- Los contadores `totalLikes`, `totalDislikes`, `totalDescargas` y `totalComentarios` ya vienen incluidos
  directamente en cada archivo devuelto por `GET /api/v1/archivos/publicados`, `GET /api/v1/archivos/me`
  y `GET /api/v1/archivos/:id`. No es necesario pedirlos por separado.