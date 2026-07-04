# Guardados de Archivos

## Guardar archivo
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

## Quitar archivo guardado
- Método: `DELETE`
- Ruta: `/api/v1/guardados/:archivoId`
- Descripción: Elimina un archivo guardado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.

## Listar archivos guardados por usuario
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

## Contar archivos guardados por usuario
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
