import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RiwiMediCare API",
            version: "1.0.0",
            description:
                "API REST para administrar el ciclo de vida de las solicitudes de abastecimiento de medicamentos. Permite gestionar clínicas, almacenes, medicamentos y solicitudes con autenticación JWT.",
            contact: { name: "RiwiMediCare Dev Team" },
        },
        servers: [
            { url: `http://localhost:${env.port}`, description: "Servidor local" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Ingresa el token JWT obtenido del endpoint /api/auth/login",
                },
            },
            schemas: {
                // ── Auth ─────────────────────────────────────────────────────────
                RegisterInput: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "Juan Pérez" },
                        email: { type: "string", format: "email", example: "juan@riwi.com" },
                        password: { type: "string", minLength: 6, example: "secreto123" },
                        role: { type: "string", enum: ["admin", "gestor"], default: "gestor" },
                    },
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "juan@riwi.com" },
                        password: { type: "string", example: "secreto123" },
                    },
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Juan Pérez" },
                        email: { type: "string", example: "juan@riwi.com" },
                        role: { type: "string", enum: ["admin", "gestor"] },
                    },
                },
                // ── Clinic ───────────────────────────────────────────────────────
                ClinicInput: {
                    type: "object",
                    required: ["name", "address", "phone", "responsible_name", "responsible_email"],
                    properties: {
                        name: { type: "string", example: "Clínica Norte" },
                        address: { type: "string", example: "Calle 10 #23-45" },
                        phone: { type: "string", example: "3001234567" },
                        responsible_name: { type: "string", example: "Dr. García" },
                        responsible_email: { type: "string", format: "email", example: "garcia@norte.com" },
                    },
                },
                Clinic: {
                    allOf: [
                        { $ref: "#/components/schemas/ClinicInput" },
                        {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" },
                            },
                        },
                    ],
                },
                // ── Warehouse ────────────────────────────────────────────────────
                WarehouseInput: {
                    type: "object",
                    required: ["name", "location", "capacity"],
                    properties: {
                        name: { type: "string", example: "Bodega Central" },
                        location: { type: "string", example: "Bogotá, Zona Industrial" },
                        capacity: { type: "integer", example: 5000 },
                    },
                },
                Warehouse: {
                    allOf: [
                        { $ref: "#/components/schemas/WarehouseInput" },
                        {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" },
                            },
                        },
                    ],
                },
                // ── Medication ───────────────────────────────────────────────────
                MedicationInput: {
                    type: "object",
                    required: ["name", "description", "quantity", "unit", "warehouse_id"],
                    properties: {
                        name: { type: "string", example: "Ibuprofeno" },
                        description: { type: "string", example: "Antiinflamatorio de uso común" },
                        quantity: { type: "integer", example: 500 },
                        unit: { type: "string", example: "mg" },
                        warehouse_id: { type: "integer", example: 1 },
                    },
                },
                Medication: {
                    allOf: [
                        { $ref: "#/components/schemas/MedicationInput" },
                        {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                createdAt: { type: "string", format: "date-time" },
                                updatedAt: { type: "string", format: "date-time" },
                            },
                        },
                    ],
                },
                // ── SupplyRequest ─────────────────────────────────────────────────
                SupplyRequestInput: {
                    type: "object",
                    required: ["clinic_id", "medication_id", "quantity_requested"],
                    properties: {
                        clinic_id: { type: "integer", example: 1 },
                        medication_id: { type: "integer", example: 3 },
                        quantity_requested: { type: "integer", example: 100 },
                        notes: { type: "string", example: "Urgente para UCI" },
                    },
                },
                SupplyRequest: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        clinic_id: { type: "integer", example: 1 },
                        warehouse_id: { type: "integer", nullable: true, example: 2 },
                        medication_id: { type: "integer", example: 3 },
                        quantity_requested: { type: "integer", example: 100 },
                        status: {
                            type: "string",
                            enum: ["pendiente", "aprobada", "rechazada", "entregada"],
                            example: "pendiente",
                        },
                        requested_by: { type: "integer", example: 5 },
                        notes: { type: "string", example: "Urgente para UCI" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AssignWarehouseInput: {
                    type: "object",
                    required: ["warehouse_id"],
                    properties: {
                        warehouse_id: { type: "integer", example: 2 },
                    },
                },
                UpdateStatusInput: {
                    type: "object",
                    required: ["status"],
                    properties: {
                        status: {
                            type: "string",
                            enum: ["pendiente", "aprobada", "rechazada", "entregada"],
                            example: "aprobada",
                        },
                    },
                },
                // ── Common ───────────────────────────────────────────────────────
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "Operación exitosa" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Descripción del error" },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "Registro, login y perfil de usuario" },
            { name: "Clinics", description: "Gestión de clínicas y sus responsables" },
            { name: "Warehouses", description: "Gestión de almacenes de medicamentos" },
            { name: "Medications", description: "Inventario de medicamentos" },
            { name: "SupplyRequests", description: "Solicitudes de abastecimiento" },
            { name: "Seeder", description: "Carga masiva de datos iniciales (admin)" },
        ],
        paths: {
            // ════════════════════════════ AUTH ════════════════════════════════
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Registro de usuario",
                    description: "Crea un nuevo usuario con rol admin o gestor. Endpoint público.",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } },
                    },
                    responses: {
                        201: {
                            description: "Usuario creado exitosamente",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: { $ref: "#/components/schemas/UserResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: "El correo ya existe o datos inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Inicio de sesión",
                    description: "Autentica un usuario y devuelve un JWT.",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
                    },
                    responses: {
                        200: {
                            description: "Login exitoso",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR..." },
                                            user: { $ref: "#/components/schemas/UserResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Credenciales inválidas", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Auth"],
                    summary: "Perfil del usuario autenticado",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Datos del usuario en el token",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            user: { $ref: "#/components/schemas/UserResponse" },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Token requerido o inválido", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            // ════════════════════════════ CLINICS ════════════════════════════
            "/api/clinics": {
                get: {
                    tags: ["Clinics"],
                    summary: "Listar todas las clínicas",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Lista de clínicas",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            data: { type: "array", items: { $ref: "#/components/schemas/Clinic" } },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "No autorizado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                post: {
                    tags: ["Clinics"],
                    summary: "Crear clínica (admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ClinicInput" } } },
                    },
                    responses: {
                        201: { description: "Clínica creada", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean", example: true }, data: { $ref: "#/components/schemas/Clinic" } } } } } },
                        401: { description: "No autorizado" },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },
            "/api/clinics/{id}": {
                get: {
                    tags: ["Clinics"],
                    summary: "Obtener clínica por ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Clínica encontrada", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Clinic" } } } } } },
                        404: { description: "Clínica no encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                put: {
                    tags: ["Clinics"],
                    summary: "Actualizar clínica (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ClinicInput" } } } },
                    responses: {
                        200: { description: "Clínica actualizada", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                        404: { description: "Clínica no encontrada" },
                    },
                },
                delete: {
                    tags: ["Clinics"],
                    summary: "Eliminar clínica (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Clínica eliminada", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                        404: { description: "Clínica no encontrada" },
                    },
                },
            },
            "/api/clinics/{clinicId}/requests": {
                get: {
                    tags: ["Clinics", "SupplyRequests"],
                    summary: "Historial de solicitudes de una clínica",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "clinicId", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Historial de solicitudes", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                        401: { description: "No autorizado" },
                    },
                },
            },

            // ════════════════════════════ WAREHOUSES ═════════════════════════
            "/api/warehouses": {
                get: {
                    tags: ["Warehouses"],
                    summary: "Listar almacenes",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Lista de almacenes", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Warehouse" } } } } } } },
                    },
                },
                post: {
                    tags: ["Warehouses"],
                    summary: "Crear almacén (admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/WarehouseInput" } } } },
                    responses: {
                        201: { description: "Almacén creado", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Warehouse" } } } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },
            "/api/warehouses/{id}": {
                get: {
                    tags: ["Warehouses"],
                    summary: "Obtener almacén por ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Almacén encontrado", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Warehouse" } } } } } },
                        404: { description: "Almacén no encontrado" },
                    },
                },
                put: {
                    tags: ["Warehouses"],
                    summary: "Actualizar almacén (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/WarehouseInput" } } } },
                    responses: {
                        200: { description: "Almacén actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
                delete: {
                    tags: ["Warehouses"],
                    summary: "Eliminar almacén (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Almacén eliminado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },

            // ════════════════════════════ MEDICATIONS ════════════════════════
            "/api/medications": {
                get: {
                    tags: ["Medications"],
                    summary: "Listar medicamentos",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Lista de medicamentos con su almacén", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Medication" } } } } } } },
                    },
                },
                post: {
                    tags: ["Medications"],
                    summary: "Crear medicamento (admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MedicationInput" } } } },
                    responses: {
                        201: { description: "Medicamento creado", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Medication" } } } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },
            "/api/medications/{id}": {
                get: {
                    tags: ["Medications"],
                    summary: "Obtener medicamento por ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Medicamento encontrado", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Medication" } } } } } },
                        404: { description: "Medicamento no encontrado" },
                    },
                },
                put: {
                    tags: ["Medications"],
                    summary: "Actualizar medicamento (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MedicationInput" } } } },
                    responses: {
                        200: { description: "Medicamento actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
                delete: {
                    tags: ["Medications"],
                    summary: "Eliminar medicamento (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Medicamento eliminado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },

            // ════════════════════════════ SUPPLY REQUESTS ════════════════════
            "/api/requests": {
                post: {
                    tags: ["SupplyRequests"],
                    summary: "Crear solicitud de abastecimiento (gestor)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SupplyRequestInput" } } } },
                    responses: {
                        201: { description: "Solicitud creada (estado: pendiente)", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/SupplyRequest" } } } } } },
                        401: { description: "No autorizado" },
                    },
                },
                get: {
                    tags: ["SupplyRequests"],
                    summary: "Listar todas las solicitudes (admin)",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Todas las solicitudes con relaciones", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },
            "/api/requests/my": {
                get: {
                    tags: ["SupplyRequests"],
                    summary: "Mis solicitudes (gestor)",
                    description: "Retorna las solicitudes creadas por el usuario autenticado.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Solicitudes del gestor", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                    },
                },
            },
            "/api/requests/{id}": {
                get: {
                    tags: ["SupplyRequests"],
                    summary: "Detalle de una solicitud",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Solicitud encontrada", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/SupplyRequest" } } } } } },
                        404: { description: "Solicitud no encontrada" },
                    },
                },
            },
            "/api/requests/{id}/assign": {
                patch: {
                    tags: ["SupplyRequests"],
                    summary: "Asignar almacén a solicitud (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AssignWarehouseInput" } } } },
                    responses: {
                        200: { description: "Almacén asignado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Requiere rol admin" },
                        404: { description: "Solicitud no encontrada" },
                    },
                },
            },
            "/api/requests/{id}/status": {
                patch: {
                    tags: ["SupplyRequests"],
                    summary: "Cambiar estado de solicitud (admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateStatusInput" } } } },
                    responses: {
                        200: { description: "Estado actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        400: { description: "Estado inválido" },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },

            // ════════════════════════════ SEEDER ═════════════════════════════
            "/api/seed/{entity}": {
                post: {
                    tags: ["Seeder"],
                    summary: "Cargar datos iniciales desde JSON (admin)",
                    description:
                        "Sube un archivo `.json` (array de objetos) para poblar la base de datos. Las entidades soportadas son: `users`, `clinics`, `warehouses`, `medications`. Los registros duplicados se ignoran automáticamente.",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "entity",
                            in: "path",
                            required: true,
                            description: "Entidad a poblar",
                            schema: { type: "string", enum: ["users", "clinics", "warehouses", "medications"] },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    type: "object",
                                    required: ["file"],
                                    properties: {
                                        file: { type: "string", format: "binary", description: "Archivo JSON con array de objetos" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Seeder ejecutado correctamente",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: 'Seeder ejecutado: 3 registros insertados en "clinics"' },
                                            total_received: { type: "integer", example: 5 },
                                            inserted: { type: "integer", example: 3 },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: "Entidad inválida, archivo faltante o JSON malformado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        403: { description: "Requiere rol admin" },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
