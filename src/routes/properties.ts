import { Hono } from "hono";
import { PropertiesController } from "../controllers/properties/properties.controller.js";

const propertiesRouter = new Hono();

// Create property
propertiesRouter.post("/", async (c) => {
  try {
    const result = await PropertiesController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update property
propertiesRouter.put("/:id", async (c) => {
  try {
    const result = await PropertiesController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete property
propertiesRouter.delete("/:id", async (c) => {
  try {
    const result = await PropertiesController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get property by ID
propertiesRouter.get("/:id", async (c) => {
  try {
    const result = await PropertiesController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List properties (max 30)
propertiesRouter.get("/", async (c) => {
  try {
    const result = await PropertiesController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default propertiesRouter;
