import * as repo from "../repositories/supply-request.repository";
import * as clinicRepo from "../repositories/clinic.repository";
import * as medicationRepo from "../repositories/medication.repository";
import { RequestStatus, SupplyRequest } from "../models/supply-request.model";

/**
 * Obtiene un listado completo de todas las solicitudes de abastecimiento.
 * @returns {Promise<SupplyRequest[]>} El registro de peticiones.
 */
export const getAll = (): Promise<SupplyRequest[]> => repo.findAll();
/**
 * Obtiene las solicitudes activas (pendientes / aprobadas)
 */
export const getActive = (): Promise<SupplyRequest[]> => repo.findActive();

/**
 * Obtiene todas las solicitudes de un usuario específico.
 * @param {number} userId - Identificador del gestor/creador.
 * @returns {Promise<SupplyRequest[]>} Lista de las solicitudes creadas por el usuario.
 */
export const getByUser = (userId: number): Promise<SupplyRequest[]> => repo.findByUser(userId);

/**
 * Obtiene todas las solicitudes realizadas para una clínica.
 * @param {number} clinicId - Identificador de la clínica.
 * @returns {Promise<SupplyRequest[]>} Peticiones relacionadas a la clínica vinculada.
 */
export const getByClinic = (clinicId: number): Promise<SupplyRequest[]> => repo.findByClinic(clinicId);

/**
 * Consigue una solicitud exacta consultando su ID.
 * @param {number} id - Supply Request ID.
 * @returns {Promise<SupplyRequest>} El modelo de la solicitud mapeado con sus relaciones.
 * @throws Lanzará error si el ID no corresponde a ninguna solicitud.
 */
export const getById = async (id: number): Promise<SupplyRequest> => {
    const req = await repo.findById(id);
    if (!req) throw new Error("Solicitud no encontrada");
    return req;
};

/**
 * Servicio encargado de crear una nueva solicitud de abastecimiento evaluando previamente las reglas y limitantes del negocio.
 * Evaluaciones realizadas:
 * 1. Existencia de la clínica emisora.
 * 2. Existencia del medicamento solicitado.
 * 3. Suficiente stock en la base de datos de medicamentos.
 * @param {Object} data - Formato y estructura base de la solicitud.
 * @returns {Promise<SupplyRequest>} Retorna la solicitud tras integrarse en la BD.
 */
export const create = async (data: {
    clinic_id: number;
    medication_id: number;
    quantity_requested: number;
    requested_by: number;
    notes?: string;
}): Promise<SupplyRequest> => {
    // 1. Verificar que la clínica exista
    const clinic = await clinicRepo.findById(data.clinic_id);
    if (!clinic) {
        throw new Error(`La clínica con ID ${data.clinic_id} no existe`);
    }

    if (data.quantity_requested <= 0) {
        throw new Error("La cantidad solicitada debe ser mayor a cero");
    }

    // 2. Verificar que el medicamento exista
    const medication = await medicationRepo.findById(data.medication_id);
    if (!medication) {
        throw new Error(`El medicamento con ID ${data.medication_id} no existe`);
    }

    // 3. Verificar disponibilidad en inventario
    if (medication.quantity < data.quantity_requested) {
        throw new Error(
            `Stock insuficiente. Solicitado: ${data.quantity_requested}, disponible: ${medication.quantity} ${medication.unit}`
        );
    }

    return repo.create(data);
};

/**
 * Asigna un almacén de distribución y suplencia para una solicitud pendiente.
 * @param {number} id - Identificador de la solicitud emisora.
 * @param {number} warehouseId - ID del Almacén que suplirá la necesidad.
 * @returns {Promise<[affectedCount: number]>} El número de filas actualizadas en base de datos.
 */
export const assignWarehouse = async (id: number, warehouseId: number): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.assignWarehouse(id, warehouseId);
};

/**
 * Cambia el estado de una orden.
 * Se encarga de validar que la orden posea un estado coherente del ciclo de vida ENUM.
 * @param {number} id - ID de la solicitud emisora.
 * @param {RequestStatus} status - Estado exacto al cual transicionar (e.g. aprobada)
 * @returns {Promise<[affectedCount: number]>} Modificaciones realizadas de filas.
 */
export const updateStatus = async (id: number, status: RequestStatus): Promise<[affectedCount: number]> => {
    const VALID: RequestStatus[] = ["pendiente", "aprobada", "rechazada", "entregada"];
    if (!VALID.includes(status)) {
        throw new Error(`Estado inválido. Use: ${VALID.join(", ")}`);
    }
    await getById(id);
    return repo.updateStatus(id, status);
};
