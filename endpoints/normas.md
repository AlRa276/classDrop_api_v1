# Normas

## Crear norma
- Método: `POST`
- Ruta: `/api/normas`
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

## Listar normas
- Método: `GET`
- Ruta: `/api/normas`
- Descripción: Devuelve todas las normas.
- Auth: no

## Actualizar norma
- Método: `PUT`
- Ruta: `/api/normas/:id`
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

## Eliminar norma
- Método: `DELETE`
- Ruta: `/api/normas/:id`
- Descripción: Elimina una norma. Solo admin.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
