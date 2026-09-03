import * as repo from "../repositories/clinic.repository";
import { Clinic } from "../models/clinic.model";

/**
 * Retrieves all registered clinics.
 * @returns {Promise<Clinic[]>} Array of clinics.
 */
export const getAll = (): Promise<Clinic[]> => repo.findAll();

/**
 * Finds a clinic by its unique identifier.
 * @param {number} id - Clinic ID.
 * @returns {Promise<Clinic>} Found clinic entity.
 * @throws {Error} If clinic is not found.
 */
export const getById = async (id: number): Promise<Clinic> => {
    const clinic = await repo.findById(id);
    if (!clinic) throw new Error("Clinic not found");
    return clinic;
};

/**
 * Creates a new clinic record.
 * Checks for unique Tax ID (NIT) before insertion.
 * @param {Object} data - Clinic creation data.
 * @returns {Promise<Clinic>} Newly created clinic.
 * @throws {Error} If NIT is already registered.
 */
export const create = async (data: {
    name: string;
    nit: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
}): Promise<Clinic> => {
    const existing = await repo.findByNit(data.nit);
    if (existing) throw new Error(`A clinic with NIT ${data.nit} is already registered`);
    return repo.create(data);
};

/**
 * Updates an existing clinic partially.
 * @param {number} id - Clinic ID.
 * @param {Object} data - Partial fields to update.
 * @returns {Promise<[affectedCount: number]>} Number of affected rows.
 * @throws {Error} If clinic is not found or NIT is used by another clinic.
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    if (data?.nit) {
        const existing = await repo.findByNit(data.nit);
        if (existing && existing.id !== id) {
            throw new Error(`The NIT ${data.nit} is already registered to another clinic`);
        }
    }
    return repo.update(id, data);
};

/**
 * Soft deletes a clinic.
 * @param {number} id - Clinic ID.
 * @returns {Promise<number>} Number of destroyed records.
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
