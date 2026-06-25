# Resumen del Proyecto API_V1

## Inicialización del Proyecto

### 1. Configuración de NPM
Se inicializó un nuevo proyecto Node.js con npm:
```bash
npm init -y
```

**Resultado:** Se creó `package.json` con la configuración básica del proyecto.

---

## 2. Instalación de Dependencias

### Dependencias de Producción
Se instalaron las siguientes librerías principales:
```bash
npm install express pg dotenv
```

- **express** (v4.18+): Framework web para manejar rutas y middleware
- **pg** (PostgreSQL): Driver para conexión a bases de datos PostgreSQL
- **dotenv**: Gestor de variables de entorno

**Resultado:** 82 paquetes agregados

### Dependencias de Desarrollo
Se instaló nodemon como dependencia de desarrollo:
```bash
npm install -D nodemon
```

- **nodemon**: Reinicia automáticamente el servidor al detectar cambios en los archivos

**Resultado:** 26 paquetes agregados (total: 109 paquetes)

---

## 3. Configuración del Servidor

### Server Script
El servidor se ejecuta desde `src/app.js` y está configurado para correr en el puerto **3000**.

Salida esperada:
```
Servidor corriendo en http://localhost:3000
```

### Configuración de Desarrollo
Se configuró un script de desarrollo con nodemon en `package.json`:
```bash
npm run dev
```

El servidor inicia automáticamente y se reinicia al detectar cambios en los archivos.

---

## 4. Configuración de Base de Datos PostgreSQL

### Creación de Base de Datos
```sql
CREATE DATABASE classdrop_v1;
```

### Creación de Usuario
```sql
CREATE USER mariana WITH ENCRYPTED PASSWORD 'taquito';
```

### Asignación de Permisos
```sql
GRANT ALL PRIVILEGES ON DATABASE classdrop_v1 TO mariana;
```

### Conexión a la Base de Datos
```bash
psql -U mariana -d classdrop_v1 -h localhost
```

**Credenciales:**
- Usuario: `mariana`
- Contraseña: `taquito`
- Host: `localhost`
- Base de Datos: `classdrop_v1`

---

## 5. Prueba de Conexión

Se ejecutó el archivo de prueba:
```bash
node src/testConnection.js
```

Este archivo verifica la conexión exitosa entre la aplicación Node.js y la base de datos PostgreSQL.

---

## 6. Estructura del Proyecto

```
API_V1/
├── package.json
├── .env
├── docs/
│   └── RESUMEN.md
├── src/
│   ├── app.js
│   ├── testConnection.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   └── routes/
└── node_modules/
```

---

## Variables de Entorno (.env)

Se configuraron 6 variables de entorno para la conexión a la base de datos:
- `DB_USER`: mariana
- `DB_PASSWORD`: taquito
- `DB_HOST`: localhost
- `DB_PORT`: 5432
- `DB_NAME`: classdrop_v1
- `PORT`: 3000

---

## Estado Actual

✅ Proyecto inicializado  
✅ Dependencias instaladas  
✅ Servidor funcionando en puerto 3000  
✅ Base de datos PostgreSQL configurada  
✅ Usuario y permisos de base de datos creados  
✅ Conexión a la base de datos verificada  

---

## Próximos Pasos

- [ ] Implementar modelos de datos en `src/models/`
- [ ] Crear controladores en `src/controllers/`
- [ ] Definir rutas en `src/routes/`
- [ ] Agregar validaciones y middleware
- [ ] Implementar autenticación si es necesario
- [ ] Crear endpoints para CRUD de datos
- [ ] Agregar tests unitarios
- [ ] Documentación de API endpoints
