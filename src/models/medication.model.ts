import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface MedicationAttributes {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    warehouse_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MedicationCreationAttributes = Optional<MedicationAttributes, "id">;

export class Medication
    extends Model<MedicationAttributes, MedicationCreationAttributes>
    implements MedicationAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public quantity!: number;
    public unit!: string;
    public warehouse_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Medication.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        unit: { type: DataTypes.STRING, allowNull: false },
        warehouse_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    { sequelize, tableName: "medications", timestamps: true, paranoid: true }
);
