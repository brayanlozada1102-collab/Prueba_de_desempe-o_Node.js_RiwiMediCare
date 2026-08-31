import * as repo from "../repositories/clinic.repository";

export const getAll = () => repo.findAll();

export const getById = async (id: number) => {
    const clinic = await repo.findById(id);
    if (!clinic) throw new Error("Clínica no encontrada");
    return clinic;
};

export const create = async (data: {
    name: string;
    nit: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
}) => {
    const existing = await repo.findByNit(data.nit);
    if (existing) throw new Error(`Ya existe una clínica registrada con el NIT ${data.nit}`);
    return repo.create(data);
};

export const update = async (id: number, data: Parameters<typeof repo.update>[1]) => {
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

export const remove = async (id: number) => {
    await getById(id);
    return repo.remove(id);
};
