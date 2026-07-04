# Cuatrimestres

## Listar cuatrimestres
- Método: `GET`
- Ruta: `/api/v1/cuatrimestres`
- Descripción: Obtiene la lista de cuatrimestres precargados.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-cuatrimestre",
      "nombre": "Primer Cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```

## Obtener cuatrimestre por id
- Método: `GET`
- Ruta: `/api/v1/cuatrimestres/:id`
- Descripción: Obtiene un cuatrimestre por su identificador.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-cuatrimestre",
    "nombre": "Primer Cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```
