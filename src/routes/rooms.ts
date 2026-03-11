import { Hono } from "hono";
import { RoomsController } from "../controllers/rooms/rooms.controller.js";

const roomsRouter = new Hono();

// Create room
roomsRouter.post("/", async (c) => {
  try {
    const result = await RoomsController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update room
roomsRouter.put("/:id", async (c) => {
  try {
    const result = await RoomsController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete room
roomsRouter.delete("/:id", async (c) => {
  try {
    const result = await RoomsController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get room by ID
roomsRouter.get("/:id", async (c) => {
  try {
    const result = await RoomsController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List rooms (max 30)
roomsRouter.get("/", async (c) => {
  try {
    const result = await RoomsController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default roomsRouter;
