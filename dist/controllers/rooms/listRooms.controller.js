import { listRoomsModel } from "../../models/rooms/listRooms.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";
export async function listRoomsController(req) {
    // Public endpoint: no auth or session checks
    // Pagination params from query string (defaults)
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await listRoomsModel(limit, offset);
    return normalizeResult(result);
}
