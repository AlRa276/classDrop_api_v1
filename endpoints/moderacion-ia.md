# Moderación IA

## Registrar moderación IA
- Método: `POST`
- Ruta: `/api/moderacion-ia`
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

## Listar moderaciones por archivo
- Método: `GET`
- Ruta: `/api/moderacion-ia/archivo/:archivoId`
- Descripción: Devuelve las moderaciones de IA asociadas a un archivo. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
