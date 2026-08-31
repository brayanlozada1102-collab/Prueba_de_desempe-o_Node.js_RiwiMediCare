import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface WarehouseAttributes {
    id: number;
    name: string;
    location: string;
    capacity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type WarehouseCreationAttributes = Optional<WarehouseAttributes, "id">;

export class Warehouse
    extends Model<WarehouseAttributes, WarehouseCreationAttributes>
    implements WarehouseAttributes {
    public id!: number;
    public name!: string;
    public location!: string;
    public capacity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Warehouse.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, tableName: "warehouses", timestamps: true, paranoid: true }
);
