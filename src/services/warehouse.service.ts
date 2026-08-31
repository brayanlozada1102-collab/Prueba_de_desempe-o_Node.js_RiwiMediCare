import * as repo from "../repositories/warehouse.repository";
import { Warehouse } from "../models/warehouse.model";

/**
 * Obtiene todos los almacenes registrados de RIWI.
 * @returns {Promise<Warehouse[]>} Promesa con el array de Almacenes.
 */
export const getAll = (): Promise<Warehouse[]> => repo.findAll();

/**
 * Busca un almacén por ID.
 * @param {number} id Identificador de almacén
 * @returns {Promise<Warehouse>} El almacén en caso de existir, lanza error sino.
 */
export const getById = async (id: number): Promise<Warehouse> => {
    const warehouse = await repo.findById(id);
    if (!warehouse) throw new Error("Almacén no encontrado");
    return warehouse;
};

/**
 * Registra un nuevo almacén.
 * @param {Object} data Estructura base para el almacén (location, capacity).
 * @returns {Promise<Warehouse>} Almacén insertado.
 */
export const create = (data: {
    name: string;
    location: string;
    capacity: number;
}): Promise<Warehouse> => repo.create(data);

/**
 * Edita información de un almacén existente.
 * @param {number} id Identificador del almacén a editar.
 * @param {Object} data Data parcial (optional keys) del almacén.
 * @returns {Promise<[affectedCount: number]>} Número de filas aplicadas.
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    return repo.update(id, data);
};

/**
 * Borra un registro del almacén temporalmente.
 * @param {number} id Identificador referencial a borrar.
 * @returns {Promise<number>} Conteo final.
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
