import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface ClinicAttributes {
    id: number;
    name: string;
    address: string;
    phone: string;
    responsible_name: string;
    responsible_email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ClinicCreationAttributes = Optional<ClinicAttributes, "id">;

export class Clinic
    extends Model<ClinicAttributes, ClinicCreationAttributes>
    implements ClinicAttributes {
    public id!: number;
    public name!: string;
    public address!: string;
    public phone!: string;
    public responsible_name!: string;
    public responsible_email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Clinic.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        responsible_name: { type: DataTypes.STRING, allowNull: false },
        responsible_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true },
        },
    },
    { sequelize, tableName: "clinics", timestamps: true }
);
