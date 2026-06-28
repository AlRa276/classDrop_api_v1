# Descargas de Archivos

## Registrar descarga
- Método: `POST`
- Ruta: `/api/descargas-archivo`
- Descripción: Registra la descarga de un archivo por un usuario autenticado.
- Auth: sí
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "archivoId": "uuid-del-archivo",
  "adjuntoId": "uuid-del-adjunto-opcional"
}
```

## Listar descargas del usuario
- Método: `GET`
- Ruta: `/api/descargas-archivo/usuario`
- Descripción: Devuelve las descargas realizadas por el usuario autenticado.
- Auth: sí

## Contar descargas del usuario
- Método: `GET`
- Ruta: `/api/descargas-archivo/usuario/contador`
- Descripción: Devuelve el total de descargas realizadas por el usuario autenticado.
- Auth: sí

## Listar descargas por archivo
- Método: `GET`
- Ruta: `/api/descargas-archivo/archivo/:archivoId`
- Descripción: Devuelve las descargas registradas para un archivo específico.
- Auth: sí
