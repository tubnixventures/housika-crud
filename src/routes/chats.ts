import { Hono } from "hono";
import { ChatsController } from "../controllers/chats/chats.controller";

const chatsRouter = new Hono();

// Create chat
chatsRouter.post("/", async (c) => {
  try {
    const result = await ChatsController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update chat
chatsRouter.put("/:id", async (c) => {
  try {
    const result = await ChatsController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete chat
chatsRouter.delete("/:id", async (c) => {
  try {
    const result = await ChatsController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get chat by ID
chatsRouter.get("/:id", async (c) => {
  try {
    const result = await ChatsController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List chats
chatsRouter.get("/", async (c) => {
  try {
    const result = await ChatsController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default chatsRouter;
