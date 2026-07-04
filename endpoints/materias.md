# Materias

## Listar todas las materias
- Método: `GET`
- Ruta: `/api/v1/materias`
- Descripción: Devuelve todas las materias activas.
- Query params:
  - `search` (opcional): filtra materias cuyo nombre contenga el texto indicado (no sensible a mayúsculas).
  - `limit` (opcional): limita la cantidad de resultados devueltos. Debe ser un entero positivo.
- Auth: no
- Ejemplo: `/api/v1/materias?search=calculo&limit=5`
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-materia",
      "nombre": "Arquitectura de Software",
      "icono": "📘",
      "cuatrimestreId": "uuid-del-cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```

## Listar materias por cuatrimestre
- Método: `GET`
- Ruta: `/api/v1/materias/cuatrimestre/:id`
- Descripción: Devuelve las materias de un cuatrimestre específico.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-de-la-materia",
      "nombre": "Arquitectura de Software",
      "icono": "📘",
      "cuatrimestreId": "uuid-del-cuatrimestre",
      "activo": true
    }
  ],
  "meta": null,
  "error": null
}
```

## Obtener materia por id
- Método: `GET`
- Ruta: `/api/v1/materias/:id`
- Descripción: Devuelve los datos de una materia específica.
- Auth: no
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```

## Crear materia
- Método: `POST`
- Ruta: `/api/v1/materias`
- Descripción: Crea una nueva materia.
- Body:
```json
{
  "nombre": "Arquitectura de Software",
  "icono": "📘",
  "cuatrimestreId": "uuid-del-cuatrimestre"
}
```
- Auth: sí (admin)
- Errores: `422` si faltan campos obligatorios, `409` si ya existe una materia con ese nombre en ese cuatrimestre.
- Respuesta exitosa (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```

## Actualizar materia
- Método: `PUT`
- Ruta: `/api/v1/materias/:id`
- Descripción: Actualiza los datos de una materia existente.
- Body: cualquier combinación de `nombre`, `icono`, `cuatrimestreId`, `activo`.
- Auth: sí (admin)
- Errores: `404` si no existe, `409` si el nuevo nombre/cuatrimestre ya está en uso por otra materia.
- Respuesta exitosa (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-materia",
    "nombre": "Arquitectura de Software",
    "icono": "📘",
    "cuatrimestreId": "uuid-del-cuatrimestre",
    "activo": true
  },
  "meta": null,
  "error": null
}
```

## Eliminar materia
- Método: `DELETE`
- Ruta: `/api/materias/:id`
- Descripción: Elimina (baja lógica) una materia, marcándola como inactiva.
- Auth: sí (admin)
- Errores: `404` si no existe.