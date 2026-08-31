import * as repo from "../repositories/supply-request.repository";
import * as clinicRepo from "../repositories/clinic.repository";
import * as medicationRepo from "../repositories/medication.repository";
import { RequestStatus } from "../models/supply-request.model";

export const getAll = () => repo.findAll();

export const getByUser = (userId: number) => repo.findByUser(userId);

export const getByClinic = (clinicId: number) => repo.findByClinic(clinicId);

export const getById = async (id: number) => {
    const req = await repo.findById(id);
    if (!req) throw new Error("Solicitud no encontrada");
    return req;
};

export const create = async (data: {
    clinic_id: number;
    medication_id: number;
    quantity_requested: number;
    requested_by: number;
    notes?: string;
}) => {
    // 1. Verificar que la clínica exista
    const clinic = await clinicRepo.findById(data.clinic_id);
    if (!clinic) {
        throw new Error(`La clínica con ID ${data.clinic_id} no existe`);
    }

    // 2. Verificar que el medicamento exista
    const medication = await medicationRepo.findById(data.medication_id);
    if (!medication) {
        throw new Error(`El medicamento con ID ${data.medication_id} no existe`);
    }

    // 3. Verificar disponibilidad en inventario
    if (medication.quantity < data.quantity_requested) {
        throw new Error(
            `Stock insuficiente. Solicitado: ${data.quantity_requested}, disponible: ${medication.quantity} ${medication.unit}`
        );
    }

    return repo.create(data);
};

export const assignWarehouse = async (id: number, warehouseId: number) => {
    await getById(id);
    return repo.assignWarehouse(id, warehouseId);
};

export const updateStatus = async (id: number, status: RequestStatus) => {
    const VALID: RequestStatus[] = ["pendiente", "aprobada", "rechazada", "entregada"];
    if (!VALID.includes(status)) {
        throw new Error(`Estado inválido. Use: ${VALID.join(", ")}`);
    }
    await getById(id);
    return repo.updateStatus(id, status);
};
