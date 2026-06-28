# Reportes

## Crear reporte
- Método: `POST`
- Ruta: `/api/reportes`
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

```json
{
  "tipoContenido": "comentario",
  "comentarioId": "uuid-del-comentario",
  "puntuacion": 3
}
```

## Listar reportes pendientes
- Método: `GET`
- Ruta: `/api/reportes/pendientes`
- Descripción: Obtiene los reportes pendientes. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Resolver reporte
- Método: `PUT`
- Ruta: `/api/reportes/:id/resolver`
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
