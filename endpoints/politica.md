# Políticas

## Listar políticas
- Método: `GET`
- Ruta: `/api/v1/politicas`
- Descripción: Obtiene la lista de todas las políticas activas.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-politica",
      "categoria": "privacidad",
      "titulo": "Política de Privacidad",
      "contenido": "Contenido de la política...",
      "icono": "privacy-icon",
      "esPrincipal": true,
      "orden": 1,
      "activo": true,
      "creado_en": "2026-07-02T12:34:56.000Z",
      "actualizado_en": "2026-07-02T12:34:56.000Z"
    }
  ],
  "meta": null,
  "error": null
}
```

## Obtener política principal
- Método: `GET`
- Ruta: `/api/v1/politicas/principal`
- Descripción: Obtiene la política marcada como principal.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-politica",
    "categoria": "terminos_uso",
    "titulo": "Términos de Uso",
    "contenido": "Contenido de los términos...",
    "icono": "terms-icon",
    "esPrincipal": true,
    "orden": 1,
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z",
    "actualizado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Obtener política por ID
- Método: `GET`
- Ruta: `/api/v1/politicas/:id`
- Descripción: Obtiene una política específica por su ID.
- Auth: no
- Parámetros:
  - `id` (path): UUID de la política
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-politica",
    "categoria": "reglamento_interno",
    "titulo": "Reglamento Interno",
    "contenido": "Contenido del reglamento...",
    "icono": "rules-icon",
    "esPrincipal": false,
    "orden": 2,
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z",
    "actualizado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Crear política
- Método: `POST`
- Ruta: `/api/v1/politicas`
- Descripción: Crea una nueva política. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "categoria": "privacidad",
  "titulo": "Política de Privacidad Actualizada",
  "contenido": "Contenido completo de la política...",
  "icono": "privacy-icon",
  "esPrincipal": false,
  "orden": 1,
  "activo": true
}
```
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-politica",
    "categoria": "privacidad",
    "titulo": "Política de Privacidad Actualizada",
    "contenido": "Contenido completo de la política...",
    "icono": "privacy-icon",
    "esPrincipal": false,
    "orden": 1,
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z",
    "actualizado_en": "2026-07-02T12:34:56.000Z"
  },
  "meta": null,
  "error": null
}
```

## Actualizar política
- Método: `PUT`
- Ruta: `/api/v1/politicas/:id`
- Descripción: Actualiza una política existente. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Parámetros:
  - `id` (path): UUID de la política a actualizar
- Body:
```json
{
  "categoria": "seguridad",
  "titulo": "Política de Seguridad",
  "contenido": "Contenido actualizado...",
  "icono": "security-icon",
  "esPrincipal": true,
  "orden": 1,
  "activo": true
}
```
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-politica",
    "categoria": "seguridad",
    "titulo": "Política de Seguridad",
    "contenido": "Contenido actualizado...",
    "icono": "security-icon",
    "esPrincipal": true,
    "orden": 1,
    "activo": true,
    "creado_en": "2026-07-02T12:34:56.000Z",
    "actualizado_en": "2026-07-05T10:20:30.000Z"
  },
  "meta": null,
  "error": null
}
```

## Eliminar política
- Método: `DELETE`
- Ruta: `/api/v1/politicas/:id`
- Descripción: Elimina una política. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Parámetros:
  - `id` (path): UUID de la política a eliminar
- Respuesta exitosa (`204 No Content`):
```json
```

## Notas
- **Categorías disponibles**: `privacidad`, `seguridad`, `reglamento_interno`, `terminos_uso`, `general`
- **esPrincipal**: Solo una política puede ser la principal
- **orden**: Número que determina el orden de visualización
- **activo**: Controla si la política es visible
