import { listPropertiesModel } from "../../models/properties/listProperties.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function listPropertiesController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  // Pagination params from query string (defaults)
  const limit = parseInt(req.query.limit, 10) || 30;
  const offset = parseInt(req.query.offset, 10) || 0;

  // Company roles can see all properties
  const companyRoles = ["customer_care", "ceo", "admin"];
  let result;

  if (companyRoles.includes(payload.role)) {
    result = await listPropertiesModel(limit, offset); // fetch all properties
  } else {
    result = await listPropertiesModel(limit, offset, payload.id); // fetch properties tied to landlord_id
  }

  return normalizeResult(result);
}
