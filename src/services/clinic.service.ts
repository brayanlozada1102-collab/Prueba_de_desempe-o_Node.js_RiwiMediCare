import * as repo from "../repositories/clinic.repository";
import { Clinic } from "../models/clinic.model";

/**
 * Obtiene todas las clínicas registradas en el sistema.
 * @returns {Promise<Clinic[]>} Una promesa que se resuelve con un array de clínicas.
 */
export const getAll = (): Promise<Clinic[]> => repo.findAll();

/**
 * Obtiene una clínica por su identificador único.
 * @param {number} id - Identificador de la clínica.
 * @returns {Promise<Clinic>} Una promesa que se resuelve con la clínica encontrada.
 * @throws {Error} Si la clínica no es encontrada.
 */
export const getById = async (id: number): Promise<Clinic> => {
    const clinic = await repo.findById(id);
    if (!clinic) throw new Error("Clínica no encontrada");
    return clinic;
};

/**
 * Crea el registro de una nueva clínica en el sistema.
 * Verifica previamente la existencia de su NIT para evitar duplicaciones.
 * @param {Object} data - Datos de creación de la clínica.
 * @returns {Promise<Clinic>} Promesa que resuelve a la nueva clínica creada.
 * @throws {Error} Si el NIT ya existe.
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
    if (existing) throw new Error(`Ya existe una clínica registrada con el NIT ${data.nit}`);
    return repo.create(data);
};

/**
 * Actualiza parcialmente la información de una clínica.
 * @param {number} id - ID de la clínica a actualizar.
 * @param {Object} data - Interfaz con los datos a actualizar.
 * @returns {Promise<[affectedCount: number]>} El número de filas afectadas.
 * @throws {Error} Si la clínica no existe o el nuevo NIT pertenece a otra clínica.
 */
export const update = async (id: number, data: Parameters<typeof repo.update>[1]): Promise<[affectedCount: number]> => {
    await getById(id);
    // Si se actualiza el NIT, verificar que no lo use otra clínica
    if (data?.nit) {
        const existing = await repo.findByNit(data.nit);
        if (existing && existing.id !== id) {
            throw new Error(`El NIT ${data.nit} ya está registrado en otra clínica`);
        }
    }
    return repo.update(id, data);
};

/**
 * Elimina lógicamente (o referencialmente) una clínica.
 * @param {number} id - Identificador de la clínica a eliminar.
 * @returns {Promise<number>} Número de registros destruidos.
 */
export const remove = async (id: number): Promise<number> => {
    await getById(id);
    return repo.remove(id);
};
