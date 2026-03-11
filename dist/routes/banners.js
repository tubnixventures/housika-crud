import { Hono } from "hono";
import { BannersController } from "../controllers/banners/banners.controller.js";
const bannersRouter = new Hono();
// Create banner
bannersRouter.post("/", async (c) => {
    try {
        const result = await BannersController.create(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Update banner
bannersRouter.put("/:id", async (c) => {
    try {
        const result = await BannersController.update(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Delete banner
bannersRouter.delete("/:id", async (c) => {
    try {
        const result = await BannersController.delete(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Get banner by ID
bannersRouter.get("/:id", async (c) => {
    try {
        const result = await BannersController.get(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// List banners (max 30, active only)
bannersRouter.get("/", async (c) => {
    try {
        const result = await BannersController.list(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
export default bannersRouter;
