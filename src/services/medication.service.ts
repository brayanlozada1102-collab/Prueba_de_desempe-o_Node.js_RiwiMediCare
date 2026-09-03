import * as repo from "../repositories/medication.repository";
import { Medication } from "../models/medication.model";

/**
 * Retrieves all medications from the catalog.
 * @returns {Promise<Medication[]>} List of all medication items.
 */
export const getAll = (): Promise<Medication[]> => repo.findAll();

/**
 * Finds a medication by its unique identifier.
 * @param {number} id - Medication ID.
 * @returns {Promise<Medication>} Medication record.
 * @throws {Error} If medication is not found.
 */
export const getById = async (id: number): Promise<Medication> => {
    const med = await repo.findById(id);
    if (!med) throw new Error("Medication not found");
    return med;
};

/**
 * Registers a new medication in the inventory assigned to a specific warehouse.
 * @param {Object} data - Medication schema (name, description, quantity, unit, warehouse_id).
 * @returns {Promise<Medication>} Created medication entity.
 */
export const create = (data: {
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
}): Promise<Medication> => repo.create(data);

/**
 * Updates medication fields or stock quantities.
 * @param {number} id - Medication ID.
 * @param {Object} data - Update data.
 * @returns {Promise<[affectedCount: number]>} Number of affected rows.
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.update(id, data);
};

/**
 * Soft deletes a medication from inventory.
 * @param {number} id - Medication ID.
 * @returns {Promise<number>} Number of deleted records.
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
