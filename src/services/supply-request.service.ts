import * as repo from "../repositories/supply-request.repository";
import * as clinicRepo from "../repositories/clinic.repository";
import * as medicationRepo from "../repositories/medication.repository";
import { RequestStatus, SupplyRequest } from "../models/supply-request.model";

/**
 * Retrieves all supply requests across the system.
 * @returns {Promise<SupplyRequest[]>} List of all supply requests.
 */
export const getAll = (): Promise<SupplyRequest[]> => repo.findAll();

/**
 * Retrieves all active supply requests (status: 'pendiente' or 'aprobada').
 * @returns {Promise<SupplyRequest[]>} List of active supply requests.
 */
export const getActive = (): Promise<SupplyRequest[]> => repo.findActive();

/**
 * Retrieves all supply requests created by a specific user (manager).
 * @param {number} userId - Identifier of the requester.
 * @returns {Promise<SupplyRequest[]>} Requests created by the specified user.
 */
export const getByUser = (userId: number): Promise<SupplyRequest[]> => repo.findByUser(userId);

/**
 * Retrieves all supply requests associated with a clinic.
 * @param {number} clinicId - Clinic ID.
 * @returns {Promise<SupplyRequest[]>} Requests related to the specified clinic.
 */
export const getByClinic = (clinicId: number): Promise<SupplyRequest[]> => repo.findByClinic(clinicId);

/**
 * Finds a supply request by its unique identifier.
 * @param {number} id - Supply Request ID.
 * @returns {Promise<SupplyRequest>} Supply request model with its associations.
 * @throws {Error} If request is not found.
 */
export const getById = async (id: number): Promise<SupplyRequest> => {
    const req = await repo.findById(id);
    if (!req) throw new Error("Supply request not found");
    return req;
};

/**
 * Creates a new medical supply request after validating business rules:
 * 1. Existence of the requesting clinic.
 * 2. Requested quantity greater than zero.
 * 3. Existence of the requested medication.
 * 4. Sufficient stock available in warehouse inventory.
 * @param {Object} data - Supply request payload.
 * @returns {Promise<SupplyRequest>} Created supply request.
 */
export const create = async (data: {
    clinic_id: number;
    medication_id: number;
    quantity_requested: number;
    requested_by: number;
    notes?: string;
}): Promise<SupplyRequest> => {
    // 1. Verify that clinic exists
    const clinic = await clinicRepo.findById(data.clinic_id);
    if (!clinic) {
        throw new Error(`Clinic with ID ${data.clinic_id} does not exist`);
    }

    if (data.quantity_requested <= 0) {
        throw new Error("Requested quantity must be greater than zero");
    }

    // 2. Verify that medication exists
    const medication = await medicationRepo.findById(data.medication_id);
    if (!medication) {
        throw new Error(`Medication with ID ${data.medication_id} does not exist`);
    }

    // 3. Verify stock availability
    if (medication.quantity < data.quantity_requested) {
        throw new Error(
            `Insufficient stock. Requested: ${data.quantity_requested}, available: ${medication.quantity} ${medication.unit}`
        );
    }

    return repo.create(data);
};

/**
 * Assigns a distribution warehouse to supply a pending request.
 * @param {number} id - Supply request ID.
 * @param {number} warehouseId - Warehouse ID.
 * @returns {Promise<[affectedCount: number]>} Number of affected database rows.
 */
export const assignWarehouse = async (id: number, warehouseId: number): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.assignWarehouse(id, warehouseId);
};

/**
 * Updates the lifecycle status of a supply request.
 * Validates that the target status is a valid ENUM value.
 * @param {number} id - Supply request ID.
 * @param {RequestStatus} status - Target status (e.g., 'aprobada', 'entregada', 'rechazada').
 * @returns {Promise<[affectedCount: number]>} Number of affected database rows.
 */
export const updateStatus = async (id: number, status: RequestStatus): Promise<[affectedCount: number]> => {
    const VALID: RequestStatus[] = ["pendiente", "aprobada", "rechazada", "entregada"];
    if (!VALID.includes(status)) {
        throw new Error(`Invalid status. Use: ${VALID.join(", ")}`);
    }
    await getById(id);
    return repo.updateStatus(id, status);
};
