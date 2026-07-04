# Likes en Archivos

## Dar like a un archivo
- Método: `POST`
- Ruta: `/api/v1/likes/archivos/:archivoId`
- Descripción: Registra un like para un archivo. Usuario autenticado.
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

## Quitar like de un archivo
- Método: `DELETE`
- Ruta: `/api/v1/likes/archivos/:archivoId`
- Descripción: Elimina el like del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
