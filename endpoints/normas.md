# Normas

## Crear norma
- Método: `POST`
- Ruta: `/api/v1/normas`
- Descripción: Crea una nueva norma o guía en la plataforma. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "titulo": "Reglas de uso",
  "descripcion": "Normas para compartir archivos."
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-norma",
    "titulo": "Reglas de uso",
    "descripcion": "Normas para compartir archivos.",
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Listar normas
- Método: `GET`
- Ruta: `/api/v1/normas`
- Descripción: Devuelve todas las normas.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-norma",
      "titulo": "Reglas de uso",
      "descripcion": "Normas para compartir archivos.",
      "activo": true,
      "creado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```

## Actualizar norma
- Método: `PUT`
- Ruta: `/api/v1/normas/:id`
- Descripción: Actualiza una norma existente. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "titulo": "Normas actualizadas",
  "descripcion": "Contenido actualizado de la norma."
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-norma",
    "titulo": "Normas actualizadas",
    "descripcion": "Contenido actualizado de la norma.",
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Eliminar norma
- Método: `DELETE`
- Ruta: `/api/v1/normas/:id`
- Descripción: Elimina una norma. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta exitosa (`204 No Content`):
  - Sin cuerpo de respuesta.
