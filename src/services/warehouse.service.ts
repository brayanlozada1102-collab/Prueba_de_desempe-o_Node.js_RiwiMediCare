import * as repo from "../repositories/warehouse.repository";
import { Warehouse } from "../models/warehouse.model";

/**
 * Retrieves all registered distribution warehouses.
 * @returns {Promise<Warehouse[]>} Array of warehouses.
 */
export const getAll = (): Promise<Warehouse[]> => repo.findAll();

/**
 * Finds a warehouse by its primary key.
 * @param {number} id - Warehouse ID.
 * @returns {Promise<Warehouse>} Warehouse record.
 * @throws {Error} If warehouse is not found.
 */
export const getById = async (id: number): Promise<Warehouse> => {
    const warehouse = await repo.findById(id);
    if (!warehouse) throw new Error("Warehouse not found");
    return warehouse;
};

/**
 * Creates a new distribution warehouse.
 * @param {Object} data - Warehouse attributes (name, location, capacity).
 * @returns {Promise<Warehouse>} Newly created warehouse.
 */
export const create = (data: {
    name: string;
    location: string;
    capacity: number;
}): Promise<Warehouse> => repo.create(data);

/**
 * Updates an existing warehouse.
 * @param {number} id - Warehouse ID.
 * @param {Object} data - Attributes to update.
 * @returns {Promise<[affectedCount: number]>} Number of affected rows.
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.update(id, data);
};

/**
 * Soft deletes a warehouse.
 * @param {number} id - Warehouse ID.
 * @returns {Promise<number>} Number of destroyed records.
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
