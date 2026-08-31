import { Medication } from "../models/medication.model";
import { Warehouse } from "../models/warehouse.model";

export const findAll = () =>
    Medication.findAll({ include: [{ model: Warehouse, as: "warehouse" }] });

export const findById = (id: number) =>
    Medication.findByPk(id, { include: [{ model: Warehouse, as: "warehouse" }] });

export const create = (data: {
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
}) => Medication.create(data);

export const update = (id: number, data: Partial<{
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
}>) => Medication.update(data, { where: { id } });

export const remove = (id: number) => Medication.destroy({ where: { id } });
