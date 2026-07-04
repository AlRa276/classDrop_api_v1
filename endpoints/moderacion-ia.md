# Moderación IA

## Registrar moderación IA
- Método: `POST`
- Ruta: `/api/v1/moderaciones`
- Descripción: Crea un registro de moderación de IA para un archivo. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "motivoFlag": "Contenido posiblemente inapropiado",
  "aprobado": false
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-moderacion",
    "archivoId": "uuid-del-archivo",
    "motivoFlag": "Contenido posiblemente inapropiado",
    "aprobado": false,
    "revisadoPor": "uuid-del-admin",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Listar moderaciones por archivo
- Método: `GET`
- Ruta: `/api/v1/moderaciones/archivo/:id`
- Descripción: Devuelve las moderaciones de IA asociadas a un archivo. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-moderacion",
      "archivoId": "uuid-del-archivo",
      "motivoFlag": "Contenido posiblemente inapropiado",
      "aprobado": false,
      "revisadoPor": "uuid-del-admin",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
