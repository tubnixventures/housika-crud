import { getRoomModel } from "../../models/rooms/getRoom.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function getRoomController(req: any) {
  // Public endpoint: no auth or session checks
  const result = await getRoomModel(req.params.id);
  return normalizeResult(result);
}
