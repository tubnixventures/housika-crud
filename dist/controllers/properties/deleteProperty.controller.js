import { deletePropertyModel } from "../../models/properties/deleteProperty.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";
export async function deletePropertyController(req) {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload)
        throw new Error("Invalid token");
    const blacklisted = await getSession(`bl_${token}`);
    if (blacklisted)
        throw new Error("Token blacklisted");
    // Allowed company roles
    const companyRoles = ["customer_care", "ceo", "admin"];
    // Ownership check: only landlord who owns property OR company roles can delete
    const propertyResult = await query(`SELECT landlord_id FROM properties WHERE id = ?`, [
        req.params.id,
    ]);
    const property = propertyResult.rows[0];
    if (!property)
        throw new Error("Property not found");
    if (!companyRoles.includes(payload.role) && property.landlord_id !== payload.id) {
        throw new Error("Not authorized to delete this property");
    }
    // Begin transaction
    await query("BEGIN");
    try {
        // Delete property + cascade cleanup atomically
        await deletePropertyModel(req.params.id);
        // Commit transaction
        await query("COMMIT");
        return { propertyId: req.params.id, message: "Property, rooms, bookings, and payments deleted successfully" };
    }
    catch (err) {
        // Rollback on error
        await query("ROLLBACK");
        throw err;
    }
}
