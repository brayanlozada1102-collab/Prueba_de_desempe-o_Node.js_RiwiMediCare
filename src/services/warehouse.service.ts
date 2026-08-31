import * as repo from "../repositories/warehouse.repository";

export const getAll = () => repo.findAll();

export const getById = async (id: number) => {
    const warehouse = await repo.findById(id);
    if (!warehouse) throw new Error("Almacén no encontrado");
    return warehouse;
};

export const create = (data: {
    name: string;
    location: string;
    capacity: number;
}) => repo.create(data);

export const update = async (id: number, data: Parameters<typeof repo.update>[1]) => {
    await getById(id);
    return repo.update(id, data);
};

export const remove = async (id: number) => {
    await getById(id);
    return repo.remove(id);
};
