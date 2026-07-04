# Descargas de Archivos

## Registrar descarga
- Método: `POST`
- Ruta: `/api/v1/descargas`
- Descripción: Registra la descarga de un archivo por un usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "adjuntoId": "uuid-del-adjunto-opcional"
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-descarga",
    "archivoId": "uuid-del-archivo",
    "adjuntoId": "uuid-del-adjunto-opcional",
    "usuarioId": "uuid-del-usuario",
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Listar descargas del usuario
- Método: `GET`
- Ruta: `/api/v1/descargas/usuario`
- Descripción: Devuelve las descargas realizadas por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-descarga",
      "archivoId": "uuid-del-archivo",
      "adjuntoId": "uuid-del-adjunto-opcional",
      "usuarioId": "uuid-del-usuario",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```

## Contar descargas del usuario
- Método: `GET`
- Ruta: `/api/v1/descargas/usuario/contador`
- Descripción: Devuelve el total de descargas realizadas por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 27
  },
  "meta": null,
  "error": null
}
```

## Listar descargas por archivo
- Método: `GET`
- Ruta: `/api/v1/descargas/archivo/:id`
- Descripción: Devuelve las descargas registradas para un archivo específico.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-descarga",
      "archivoId": "uuid-del-archivo",
      "adjuntoId": "uuid-del-adjunto-opcional",
      "usuarioId": "uuid-del-usuario",
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```
