import * as repo from "../repositories/medication.repository";
import { Medication } from "../models/medication.model";

/**
 * Obtiene toda la tabla de medicamentos.
 * @returns {Promise<Medication[]>} Petición que resuelve la tabla de stock general.
 */
export const getAll = (): Promise<Medication[]> => repo.findAll();

/**
 * Analiza que un medicamento exista por su UUID o ID Primario
 * @param {number} id - FK / PK 
 * @returns {Promise<Medication>} Resultado referenciado
 */
export const getById = async (id: number): Promise<Medication> => {
    const med = await repo.findById(id);
    if (!med) throw new Error("Medicamento no encontrado");
    return med;
};

/**
 * Registra un medicamento a la base general y lo ata al almacén principal
 * @param {Object} data Esquema y definición química (nombre, peso, id_almacén)
 * @returns {Promise<Medication>} Data agregada
 */
export const create = (data: {
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
}): Promise<Medication> => repo.create(data);

/**
 * Rectifica la cantidad u otros campos de la medicina
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<[affectedCount: number]>}
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.update(id, data);
};

/**
 * Elimina o descontinúa un medicamento de BD
 * @param {number} id Index key
 * @returns {Promise<number>} Action success flag
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
