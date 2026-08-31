import { Warehouse } from "../models/warehouse.model";

export const findAll = () => Warehouse.findAll();

export const findById = (id: number) => Warehouse.findByPk(id);

export const create = (data: {
    name: string;
    location: string;
    capacity: number;
}) => Warehouse.create(data);

export const update = (id: number, data: Partial<{
    name: string;
    location: string;
    capacity: number;
}>) => Warehouse.update(data, { where: { id } });

export const remove = (id: number) => Warehouse.destroy({ where: { id } });
