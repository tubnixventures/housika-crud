import { createRoomController } from "./createRoom.controller.js";
import { updateRoomController } from "./updateRoom.controller.js";
import { deleteRoomController } from "./deleteRoom.controller.js";
import { getRoomController } from "./getRoom.controller.js";
import { listRoomsController } from "./listRooms.controller.js";
import { searchRoomsController } from "./searchRooms.controller.js";

export const RoomsController = {
  create: createRoomController,
  update: updateRoomController,
  delete: deleteRoomController,
  get: getRoomController,
  list: listRoomsController,
  search: searchRoomsController, // 🔍 advanced search endpoint
};
