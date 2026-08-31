import * as repo from "../repositories/clinic.repository";

export const getAll = () => repo.findAll();

export const getById = async (id: number) => {
    const clinic = await repo.findById(id);
    if (!clinic) throw new Error("Clínica no encontrada");
    return clinic;
};

export const create = (data: {
    name: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
}) => repo.create(data);

export const update = async (id: number, data: Parameters<typeof repo.update>[1]) => {
    await getById(id);
    return repo.update(id, data);
};

export const remove = async (id: number) => {
    await getById(id);
    return repo.remove(id);
};
