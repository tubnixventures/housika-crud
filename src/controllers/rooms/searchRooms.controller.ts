import { searchRoomsModel } from "../../models/rooms/searchRooms.model.js";
import { normalizeResult } from "../../utils/normalizeResult.js";

export async function searchRoomsController(req: any) {
  // Public endpoint: no auth or session checks

  const searchText = req.query.q || ""; // user’s search string
  const limit = parseInt(req.query.limit, 10) || 30;
  const offset = parseInt(req.query.offset, 10) || 0;

  if (!searchText.trim()) {
    return normalizeResult({
      error: "Search query cannot be empty",
      data: [],
    });
  }

  const result = await searchRoomsModel(searchText, limit, offset);
  return normalizeResult(result);
}
