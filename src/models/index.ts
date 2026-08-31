import { User } from "./user.model";
import { Clinic } from "./clinic.model";
import { Warehouse } from "./warehouse.model";
import { Medication } from "./medication.model";
import { SupplyRequest } from "./supply-request.model";

// ── Medication ↔ Warehouse ──────────────────────────────────────────────────
Warehouse.hasMany(Medication, { foreignKey: "warehouse_id", as: "medications" });
Medication.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });

// ── SupplyRequest ↔ Clinic ──────────────────────────────────────────────────
Clinic.hasMany(SupplyRequest, { foreignKey: "clinic_id", as: "requests" });
SupplyRequest.belongsTo(Clinic, { foreignKey: "clinic_id", as: "clinic" });

// ── SupplyRequest ↔ Warehouse ───────────────────────────────────────────────
Warehouse.hasMany(SupplyRequest, { foreignKey: "warehouse_id", as: "requests" });
SupplyRequest.belongsTo(Warehouse, { foreignKey: "warehouse_id", as: "warehouse" });

// ── SupplyRequest ↔ Medication ──────────────────────────────────────────────
Medication.hasMany(SupplyRequest, { foreignKey: "medication_id", as: "requests" });
SupplyRequest.belongsTo(Medication, { foreignKey: "medication_id", as: "medication" });

// ── SupplyRequest ↔ User ────────────────────────────────────────────────────
User.hasMany(SupplyRequest, { foreignKey: "requested_by", as: "requests" });
SupplyRequest.belongsTo(User, { foreignKey: "requested_by", as: "requester" });

export { User, Clinic, Warehouse, Medication, SupplyRequest };