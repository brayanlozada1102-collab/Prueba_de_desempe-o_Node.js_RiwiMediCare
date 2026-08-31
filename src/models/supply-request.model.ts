import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type RequestStatus = "pendiente" | "aprobada" | "rechazada" | "entregada";

export interface SupplyRequestAttributes {
    id: number;
    clinic_id: number;
    warehouse_id: number | null;
    medication_id: number;
    quantity_requested: number;
    status: RequestStatus;
    requested_by: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type SupplyRequestCreationAttributes = Optional<
    SupplyRequestAttributes,
    "id" | "warehouse_id" | "status" | "notes"
>;

export class SupplyRequest
    extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes>
    implements SupplyRequestAttributes {
    public id!: number;
    public clinic_id!: number;
    public warehouse_id!: number | null;
    public medication_id!: number;
    public quantity_requested!: number;
    public status!: RequestStatus;
    public requested_by!: number;
    public notes?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SupplyRequest.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        clinic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "clinics", key: "id" },
        },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: { model: "warehouses", key: "id" },
        },
        medication_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "medications", key: "id" },
        },
        quantity_requested: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pendiente", "aprobada", "rechazada", "entregada"),
            allowNull: false,
            defaultValue: "pendiente",
        },
        requested_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    { sequelize, tableName: "supply_requests", timestamps: true }
);
