import { Hono } from "hono";
import { ContactMessagesController } from "../controllers/contactMessages/contactMessages.controller.js";
const contactMessagesRouter = new Hono();
// Create contact message (public, no JWT required)
contactMessagesRouter.post("/", async (c) => {
    try {
        const result = await ContactMessagesController.create(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 400);
    }
});
// Update contact message (agents/admin/ceo only)
contactMessagesRouter.put("/:id", async (c) => {
    try {
        const result = await ContactMessagesController.update(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Delete contact message (agents/admin/ceo only)
contactMessagesRouter.delete("/:id", async (c) => {
    try {
        const result = await ContactMessagesController.delete(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Get contact message by ID (any role)
contactMessagesRouter.get("/:id", async (c) => {
    try {
        const result = await ContactMessagesController.get(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// List contact messages (any role)
contactMessagesRouter.get("/", async (c) => {
    try {
        const result = await ContactMessagesController.list(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
export default contactMessagesRouter;
