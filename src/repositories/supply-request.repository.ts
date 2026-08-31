import { SupplyRequest, RequestStatus } from "../models/supply-request.model";
import { Clinic } from "../models/clinic.model";
import { Warehouse } from "../models/warehouse.model";
import { Medication } from "../models/medication.model";
import { User } from "../models/user.model";

const includes = [
    { model: Clinic, as: "clinic" },
    { model: Warehouse, as: "warehouse" },
    { model: Medication, as: "medication" },
    { model: User, as: "requester", attributes: ["id", "name", "email"] },
];

export const findAll = () => SupplyRequest.findAll({ include: includes });

export const findByUser = (userId: number) =>
    SupplyRequest.findAll({ where: { requested_by: userId }, include: includes });

export const findByClinic = (clinicId: number) =>
    SupplyRequest.findAll({ where: { clinic_id: clinicId }, include: includes });

export const findById = (id: number) =>
    SupplyRequest.findByPk(id, { include: includes });

export const create = (data: {
    clinic_id: number;
    medication_id: number;
    quantity_requested: number;
    requested_by: number;
    notes?: string;
}) => SupplyRequest.create(data);

export const assignWarehouse = (id: number, warehouseId: number) =>
    SupplyRequest.update({ warehouse_id: warehouseId }, { where: { id } });

export const updateStatus = (id: number, status: RequestStatus) =>
    SupplyRequest.update({ status }, { where: { id } });
