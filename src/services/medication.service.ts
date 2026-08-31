import * as repo from "../repositories/medication.repository";

export const getAll = () => repo.findAll();

export const getById = async (id: number) => {
    const med = await repo.findById(id);
    if (!med) throw new Error("Medicamento no encontrado");
    return med;
};

export const create = (data: {
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
}) => repo.create(data);

export const update = async (id: number, data: Parameters<typeof repo.update>[1]) => {
    await getById(id);
    return repo.update(id, data);
};

export const remove = async (id: number) => {
    await getById(id);
    return repo.remove(id);
};
