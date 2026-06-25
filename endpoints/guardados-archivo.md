# Guardados de Archivos

## Guardar archivo
- Método: `POST`
- Ruta: `/api/guardados-archivo/:archivoId`
- Descripción: Guarda un archivo en la lista de favoritos del usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Quitar archivo guardado
- Método: `DELETE`
- Ruta: `/api/guardados-archivo/:archivoId`
- Descripción: Elimina un archivo guardado por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`

## Listar archivos guardados por usuario
- Método: `GET`
- Ruta: `/api/guardados-archivo/usuario`
- Descripción: Devuelve los archivos guardados por el usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
