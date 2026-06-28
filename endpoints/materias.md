# Materias

## Listar todas las materias
- Método: `GET`
- Ruta: `/api/materias`
- Descripción: Devuelve todas las materias activas.
- Query params:
  - `search` (opcional): filtra materias cuyo nombre contenga el texto indicado (no sensible a mayúsculas).
  - `limit` (opcional): limita la cantidad de resultados devueltos. Debe ser un entero positivo.
- Auth: no
- Ejemplo: `/api/materias?search=calculo&limit=5`

## Listar materias por cuatrimestre
- Método: `GET`
- Ruta: `/api/materias/cuatrimestre/:cuatrimestreId`
- Descripción: Devuelve las materias de un cuatrimestre específico.
- Auth: no

## Obtener materia por id
- Método: `GET`
- Ruta: `/api/materias/:id`
- Descripción: Devuelve los datos de una materia específica.
- Auth: no

## Crear materia
- Método: `POST`
- Ruta: `/api/materias`
- Descripción: Crea una nueva materia.
- Body: `{ "nombre": "string", "icono": "string (opcional)", "cuatrimestreId": number }`
- Auth: sí (admin)
- Errores: `422` si faltan campos obligatorios, `409` si ya existe una materia con ese nombre en ese cuatrimestre.

## Actualizar materia
- Método: `PUT`
- Ruta: `/api/materias/:id`
- Descripción: Actualiza los datos de una materia existente.
- Body: cualquier combinación de `nombre`, `icono`, `cuatrimestreId`, `activo`.
- Auth: sí (admin)
- Errores: `404` si no existe, `409` si el nuevo nombre/cuatrimestre ya está en uso por otra materia.

## Eliminar materia
- Método: `DELETE`
- Ruta: `/api/materias/:id`
- Descripción: Elimina (baja lógica) una materia, marcándola como inactiva.
- Auth: sí (admin)
- Errores: `404` si no existe.