# Likes en Archivos

## Dar like a un archivo
- Método: `POST`
- Ruta: `/api/likes-archivo/:archivoId`
- Descripción: Registra un like para un archivo. Usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo"
}
```

## Quitar like de un archivo
- Método: `DELETE`
- Ruta: `/api/likes-archivo/:archivoId`
- Descripción: Elimina el like del usuario en el archivo.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
