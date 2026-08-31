import { Clinic } from "../models/clinic.model";

export const findAll = () => Clinic.findAll();

export const findById = (id: number) => Clinic.findByPk(id);

export const findByNit = (nit: string) => Clinic.findOne({ where: { nit } });

export const create = (data: {
    name: string;
    nit: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
}) => Clinic.create(data);

export const update = (id: number, data: Partial<{
    name: string;
    nit: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
}>) => Clinic.update(data, { where: { id } });

export const remove = (id: number) => Clinic.destroy({ where: { id } });
