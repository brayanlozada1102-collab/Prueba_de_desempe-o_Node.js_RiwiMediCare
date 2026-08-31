# RiwiMediCare - Sistema de Abastecimiento de Medicamentos

API REST para administrar el ciclo de vida de las solicitudes de abastecimiento de medicamentos, construida con Node.js, Express, TypeScript, Sequelize y PostgreSQL.

## Datos del Desarrollador
- **Nombre:** Brayan Lozada
- **Clan:** NodeJS/NestJS AM
- **Enlace del Repositorio Público:** (https://github.com/brayanlozada1102-collab/Prueba_de_desempe-o_Node.js_RiwiMediCare.git)

## Tecnologías Utilizadas
- **Lenguaje:** TypeScript
- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express
- **Base de Datos:** PostgreSQL
- **ORM:** Sequelize
- **Autenticación:** JSON Web Tokens (JWT) & bcryptjs
- **Subida y Procesamiento de Archivos (Seeder):** Multer
- **Documentación de API:** Swagger UI (OpenAPI 3.0)

## Estructura del Proyecto
```
src/
├── config/        # Configuración de BD, Swagger, y Variables de Entorno
├── controllers/   # Lógica encargada de manejar req/res y llamar a servicios
├── middlewares/   # Validadores y guardias (JWT, Roles)
├── models/        # Esquemas y definición de entidades con Sequelize
├── repositories/  # Interacción directa con la capa de Base de Datos
├── routes/        # Definición de Endpoints y conexión de validadores
├── services/      # Lógica de Negocio 
├── app.ts         # Integración central de Express y rutas
└── server.ts      # Instancia del servidor y sincronización
```

## Instructivo de Instalación

1. Clona el repositorio
```bash
git clone [URL_DE_TU_REPOSITORIO]
cd Prueba_de_desempe-o_Node.js_RiwiMediCare
```

2. Instala las dependencias
```bash
npm install
```

3. Crea una base de datos en PostgreSQL
```sql
CREATE DATABASE riwi_base_db;
```

4. Configura las variables de entorno basándote en el archivo de ejemplo (ver sección de abajo).

## Ejemplo de Variables de Entorno (.env)

Debes crear un archivo `.env` en la raíz del proyecto. Este es un ejemplo de su formato:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=riwi_base_db
JWT_SECRET=riwi_super_secreto_2026
JWT_EXPIRES_IN=2h
```

## Ejecución del Proyecto

Para ejecutar el servidor en modo desarrollo (usando `ts-node-dev`):
```bash
npm run dev
```

El servidor iniciará la conexión con la base de datos, sincronizará los modelos y te dirá:
```
Conexión a la base de datos establecida correctamente.
Servidor corriendo en http://localhost:3000
Documentación: http://localhost:3000/api/docs
```

## Cómo Ejecutar los Seeders (Carga Masiva de JSON)

El sistema cuenta con un *endpoint* protegido para que los **Adminstradores** puedan cargar grandes cantidades de datos inicialmente (clinicas, usuarios, medicamentos, almacenes).

- **URL:** `POST http://localhost:3000/api/seed/:entity`
- **Rutas de Entidades Válidas:** `/api/seed/users`, `/api/seed/clinics`, `/api/seed/warehouses`, `/api/seed/medications`

### Ejemplo con cURL (Subida de un JSON Form Data):

Primero, obtén tu JWT (debes inciar sesión con una cuenta admin):
```bash
TOKEN="tu_token_aqui"
```

Luego, envía el archivo con formato `multipart/form-data`:
```bash
curl -X POST http://localhost:3000/api/seed/clinics \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/ruta/a/tu/archivo/clinics.json"
```

### Ejemplo en Swagger:
1. Navega a `http://localhost:3000/api/docs`
2. Autentícate en el botón **Authorize**
3. Abre el Tag **Seeder** y expande `POST /api/seed/{entity}`
4. Selecciona la entidad (por ejemplo `clinics`).
5. En el parámetro `file` selecciona tu documento `.json` (desde tu PC).
6. Ejecuta (Click en Execute).