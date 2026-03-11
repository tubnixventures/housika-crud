import { Hono } from "hono";
import { MessagesController } from "../controllers/messages/messages.controller.js";

const messagesRouter = new Hono();

// Create message
messagesRouter.post("/", async (c) => {
  try {
    const result = await MessagesController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update message
messagesRouter.put("/:id", async (c) => {
  try {
    const result = await MessagesController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete message
messagesRouter.delete("/:id", async (c) => {
  try {
    const result = await MessagesController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get message by ID
messagesRouter.get("/:id", async (c) => {
  try {
    const result = await MessagesController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List messages
messagesRouter.get("/", async (c) => {
  try {
    const result = await MessagesController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default messagesRouter;
