import { deletePropertyModel } from "../../models/properties/deleteProperty.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { query } from "../../utils/db.js";

export async function deletePropertyController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Allowed company roles
  const companyRoles = ["customer_care", "ceo", "admin"];

  // Ownership check: only landlord who owns property OR company roles can delete
  const propertyResult = await query(`SELECT landlord_id FROM properties WHERE id = ?`, [
    req.params.id,
  ]);
  const property = propertyResult.rows[0];
  if (!property) throw new Error("Property not found");

  if (!companyRoles.includes(payload.role) && property.landlord_id !== payload.id) {
    throw new Error("Not authorized to delete this property");
  }

  // Validate URLs for file deletion
  const urls: string[] = req.body?.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error("Request body must include a non-empty 'urls' array");
  }

  // Harden: only allow URLs pointing to your storage domain
  const allowedDomain = process.env.allowed_storage_domain; // e.g. "https://cdn.housika.com/"
  for (const url of urls) {
    if (!allowedDomain || !url.startsWith(allowedDomain)) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  const storageUrl = process.env.storage_url;
  if (!storageUrl) {
    throw new Error("Storage URL not configured");
  }

  // Begin transaction
  await query("BEGIN");

  try {
    // Delete files from storage first
    const res = await fetch(`${storageUrl}/delete?bucket=properties`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(urls)
    });

    const storageResult = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(storageResult.error || `Failed to delete property files: ${res.statusText}`);
    }

    // Delete property + cascade cleanup atomically
    await deletePropertyModel(req.params.id);

    // Commit transaction
    await query("COMMIT");

    return {
      propertyId: req.params.id,
      message: "Property, rooms, bookings, payments, and files deleted successfully",
      storage: storageResult
    };
  } catch (err) {
    // Rollback on error
    await query("ROLLBACK");
    throw err;
  }
}
