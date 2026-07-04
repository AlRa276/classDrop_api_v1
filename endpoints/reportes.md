# Reportes

## Crear reporte
- Método: `POST`
- Ruta: `/api/v1/reportes`
- Descripción: Reporta un archivo o comentario en la plataforma.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "tipoContenido": "archivo",
  "archivoId": "uuid-del-archivo",
  "puntuacion": 4
}
```

O para reportar comentario:
```json
{
  "tipoContenido": "comentario",
  "comentarioId": "uuid-del-comentario",
  "puntuacion": 3
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-reporte",
    "reportadoPor": "uuid-del-usuario",
    "tipoContenido": "archivo",
    "archivoId": "uuid-del-archivo",
    "comentarioId": null,
    "puntuacion": 4,
    "estado": "pendiente",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Listar reportes pendientes
- Método: `GET`
- Ruta: `/api/v1/reportes/pendientes`
- Descripción: Obtiene los reportes pendientes. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-reporte",
      "reportadoPor": "uuid-del-usuario",
      "tipoContenido": "archivo",
      "archivoId": "uuid-del-archivo",
      "comentarioId": null,
      "puntuacion": 4,
      "estado": "pendiente",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```

## Resolver reporte
- Método: `PUT`
- Ruta: `/api/v1/reportes/:id/resolver`
- Descripción: Cambia el estado del reporte a `resuelto` o `descartado`. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "estado": "resuelto",
  "accionTomada": "Se eliminó el contenido tras verificación"
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-reporte",
    "estado": "resuelto",
    "resueltoPor": "uuid-del-admin",
    "accionTomada": "Se eliminó el contenido tras verificación",
    "resuelto_en": "2026-07-02T13:00:00.000Z"
  },
  "meta": null,
  "error": null
}
```
