# Comentarios

## Listar comentarios por archivo
- Método: `GET`
- Ruta: `/api/comentarios/archivo/:archivoId`
- Descripción: Obtiene todos los comentarios activos de un archivo.
- Auth: no

## Crear comentario
- Método: `POST`
- Ruta: `/api/comentarios`
- Descripción: Crea un comentario nuevo en un archivo. El usuario debe estar autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "contenido": "Texto del comentario"
}
```

## Eliminar comentario
- Método: `DELETE`
- Ruta: `/api/comentarios/:id`
- Descripción: Marca un comentario como eliminado. Solo puede hacerlo el autor.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
