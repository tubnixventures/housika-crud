import { Hono } from "hono";
import { BookingsController } from "../controllers/bookings/bookings.controller.js";

const bookingsRouter = new Hono();

// Create booking
bookingsRouter.post("/", async (c) => {
  try {
    const result = await BookingsController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update booking
bookingsRouter.put("/:id", async (c) => {
  try {
    const result = await BookingsController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete booking
bookingsRouter.delete("/:id", async (c) => {
  try {
    const result = await BookingsController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get booking by ID
bookingsRouter.get("/:id", async (c) => {
  try {
    const result = await BookingsController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List bookings (max 30)
bookingsRouter.get("/", async (c) => {
  try {
    const result = await BookingsController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default bookingsRouter;
