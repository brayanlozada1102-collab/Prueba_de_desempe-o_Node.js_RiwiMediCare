import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RiwiMediCare API",
            version: "1.0.0",
            description:
                "RESTful API to manage the lifecycle of medical supply requests. Allows management of clinics, warehouses, medications, and supply requests with JWT authentication.",
            contact: { name: "RiwiMediCare Dev Team" },
        },
        servers: [
            { url: `http://localhost:${env.port}`, description: "Local Development Server" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter the JWT token obtained from the /api/auth/login endpoint",
                },
            },
            schemas: {
                // ── Auth ─────────────────────────────────────────────────────────
                RegisterInput: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@riwimedicare.com" },
                        password: { type: "string", minLength: 6, example: "securePass123" },
                        role: { type: "string", enum: ["admin", "gestor"], default: "gestor" },
                    },
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "john@riwimedicare.com" },
                        password: { type: "string", example: "securePass123" },
                    },
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@riwimedicare.com" },
                        role: { type: "string", enum: ["admin", "gestor"] },
                    },
                },
                // ── Clinic ───────────────────────────────────────────────────────
                ClinicInput: {
                    type: "object",
                    required: ["name", "nit", "address", "phone", "responsible_name", "responsible_email"],
                    properties: {
                        name: { type: "string", example: "North Central Clinic" },
                        nit: { type: "string", example: "900123456-1", description: "Unique Tax ID (NIT) of the clinic" },
                        address: { type: "string", example: "123 Healthcare Ave, Suite 400" },
                        phone: { type: "string", example: "+1 555-0199" },
                        responsible_name: { type: "string", example: "Dr. Robert Smith" },
                        responsible_email: { type: "string", format: "email", example: "rsmith@northclinic.com" },
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
                        name: { type: "string", example: "Central Medical Warehouse" },
                        location: { type: "string", example: "Industrial Park, District 7" },
                        capacity: { type: "integer", example: 50000 },
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
                        name: { type: "string", example: "Acetaminophen 500mg" },
                        description: { type: "string", example: "Oral analgesic and antipyretic" },
                        quantity: { type: "integer", example: 5000 },
                        unit: { type: "string", example: "tablets" },
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
                        medication_id: { type: "integer", example: 1 },
                        quantity_requested: { type: "integer", example: 200 },
                        notes: { type: "string", example: "Urgent emergency room restocking" },
                    },
                },
                SupplyRequest: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        clinic_id: { type: "integer", example: 1 },
                        warehouse_id: { type: "integer", nullable: true, example: 1 },
                        medication_id: { type: "integer", example: 1 },
                        quantity_requested: { type: "integer", example: 200 },
                        status: {
                            type: "string",
                            enum: ["pendiente", "aprobada", "rechazada", "entregada"],
                            example: "pendiente",
                        },
                        requested_by: { type: "integer", example: 2 },
                        notes: { type: "string", example: "Urgent emergency room restocking" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                AssignWarehouseInput: {
                    type: "object",
                    required: ["warehouse_id"],
                    properties: {
                        warehouse_id: { type: "integer", example: 1 },
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
                        message: { type: "string", example: "Operation completed successfully" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error description message" },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "User registration, authentication and profile" },
            { name: "Clinics", description: "Management of healthcare clinics and contacts" },
            { name: "Warehouses", description: "Management of distribution warehouses" },
            { name: "Medications", description: "Pharmaceutical inventory and catalog" },
            { name: "SupplyRequests", description: "Medical supply request lifecycle" },
            { name: "Seeder", description: "Bulk JSON initial data import (Admin only)" },
        ],
        paths: {
            // ════════════════════════════ AUTH ════════════════════════════════
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "User registration",
                    description: "Registers a new user with admin or gestor (manager) role. Public endpoint.",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } },
                    },
                    responses: {
                        201: {
                            description: "User successfully created",
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
                        400: { description: "Email already exists or invalid data", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "User login",
                    description: "Authenticates a user and returns a signed JWT access token.",
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
                    },
                    responses: {
                        200: {
                            description: "Login successful",
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
                        401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },
            "/api/auth/me": {
                get: {
                    tags: ["Auth"],
                    summary: "Authenticated user profile",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Decoded token user information",
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
                        401: { description: "Token required or invalid", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
            },

            // ════════════════════════════ CLINICS ════════════════════════════
            "/api/clinics": {
                get: {
                    tags: ["Clinics"],
                    summary: "List all clinics",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "List of clinics",
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
                        401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                post: {
                    tags: ["Clinics"],
                    summary: "Create a clinic (Admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/ClinicInput" } } },
                    },
                    responses: {
                        201: { description: "Clinic created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean", example: true }, data: { $ref: "#/components/schemas/Clinic" } } } } } },
                        401: { description: "Unauthorized" },
                        403: { description: "Admin role required" },
                    },
                },
            },
            "/api/clinics/{id}": {
                get: {
                    tags: ["Clinics"],
                    summary: "Get clinic by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Clinic found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Clinic" } } } } } },
                        404: { description: "Clinic not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                    },
                },
                put: {
                    tags: ["Clinics"],
                    summary: "Update clinic (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ClinicInput" } } } },
                    responses: {
                        200: { description: "Clinic updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                        404: { description: "Clinic not found" },
                    },
                },
                delete: {
                    tags: ["Clinics"],
                    summary: "Delete clinic (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Clinic deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                        404: { description: "Clinic not found" },
                    },
                },
            },
            "/api/clinics/{clinicId}/requests": {
                get: {
                    tags: ["Clinics", "SupplyRequests"],
                    summary: "Supply request history for a clinic",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "clinicId", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Request history", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                        401: { description: "Unauthorized" },
                    },
                },
            },

            // ════════════════════════════ WAREHOUSES ═════════════════════════
            "/api/warehouses": {
                get: {
                    tags: ["Warehouses"],
                    summary: "List all warehouses",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "List of warehouses", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Warehouse" } } } } } } },
                    },
                },
                post: {
                    tags: ["Warehouses"],
                    summary: "Create a warehouse (Admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/WarehouseInput" } } } },
                    responses: {
                        201: { description: "Warehouse created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Warehouse" } } } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },
            "/api/warehouses/{id}": {
                get: {
                    tags: ["Warehouses"],
                    summary: "Get warehouse by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Warehouse found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Warehouse" } } } } } },
                        404: { description: "Warehouse not found" },
                    },
                },
                put: {
                    tags: ["Warehouses"],
                    summary: "Update warehouse (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/WarehouseInput" } } } },
                    responses: {
                        200: { description: "Warehouse updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                    },
                },
                delete: {
                    tags: ["Warehouses"],
                    summary: "Delete warehouse (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Warehouse deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },

            // ════════════════════════════ MEDICATIONS ════════════════════════
            "/api/medications": {
                get: {
                    tags: ["Medications"],
                    summary: "List all medications",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "List of medications with warehouse details", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Medication" } } } } } } },
                    },
                },
                post: {
                    tags: ["Medications"],
                    summary: "Create medication (Admin)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MedicationInput" } } } },
                    responses: {
                        201: { description: "Medication created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Medication" } } } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },
            "/api/medications/{id}": {
                get: {
                    tags: ["Medications"],
                    summary: "Get medication by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Medication found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Medication" } } } } } },
                        404: { description: "Medication not found" },
                    },
                },
                put: {
                    tags: ["Medications"],
                    summary: "Update medication (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MedicationInput" } } } },
                    responses: {
                        200: { description: "Medication updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                    },
                },
                delete: {
                    tags: ["Medications"],
                    summary: "Delete medication (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Medication deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },

            // ════════════════════════════ SUPPLY REQUESTS ════════════════════
            "/api/requests": {
                post: {
                    tags: ["SupplyRequests"],
                    summary: "Create supply request (Manager/Gestor)",
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SupplyRequestInput" } } } },
                    responses: {
                        201: { description: "Supply request created (status: pendiente)", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/SupplyRequest" } } } } } },
                        400: { description: "Insufficient stock or invalid data" },
                        401: { description: "Unauthorized" },
                    },
                },
                get: {
                    tags: ["SupplyRequests"],
                    summary: "List all supply requests (Admin)",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "All requests with associations", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },
            "/api/requests/my": {
                get: {
                    tags: ["SupplyRequests"],
                    summary: "My supply requests (Manager/Gestor)",
                    description: "Returns requests created by the currently authenticated user.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Manager supply requests", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                    },
                },
            },
            "/api/requests/active": {
                get: {
                    tags: ["SupplyRequests"],
                    summary: "Active supply requests (Admin / Manager)",
                    description: "Returns all requests with status 'pendiente' or 'aprobada'.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Active supply requests", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/SupplyRequest" } } } } } } },
                    },
                },
            },
            "/api/requests/{id}": {
                get: {
                    tags: ["SupplyRequests"],
                    summary: "Get supply request details by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    responses: {
                        200: { description: "Supply request found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/SupplyRequest" } } } } } },
                        404: { description: "Supply request not found" },
                    },
                },
            },
            "/api/requests/{id}/assign": {
                patch: {
                    tags: ["SupplyRequests"],
                    summary: "Assign distribution warehouse to request (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AssignWarehouseInput" } } } },
                    responses: {
                        200: { description: "Warehouse assigned", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        403: { description: "Admin role required" },
                        404: { description: "Supply request not found" },
                    },
                },
            },
            "/api/requests/{id}/status": {
                patch: {
                    tags: ["SupplyRequests"],
                    summary: "Update supply request status (Admin)",
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateStatusInput" } } } },
                    responses: {
                        200: { description: "Status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
                        400: { description: "Invalid status" },
                        403: { description: "Admin role required" },
                    },
                },
            },

            // ════════════════════════════ SEEDER ═════════════════════════════
            "/api/seed/{entity}": {
                post: {
                    tags: ["Seeder"],
                    summary: "Import initial bulk data from JSON (Admin)",
                    description:
                        "Uploads a `.json` file (array of objects) to populate the database. Supported entities: `users`, `clinics`, `warehouses`, `medications`. Duplicate records are automatically skipped.",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "entity",
                            in: "path",
                            required: true,
                            description: "Target entity to seed",
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
                                        file: { type: "string", format: "binary", description: "JSON file containing an array of objects" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Seeder executed successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            message: { type: "string", example: 'Seeder executed: 3 records inserted into "clinics"' },
                                            total_received: { type: "integer", example: 5 },
                                            inserted: { type: "integer", example: 3 },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: "Invalid entity, missing file, or malformed JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                        403: { description: "Admin role required" },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
