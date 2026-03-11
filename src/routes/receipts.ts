import { Hono } from "hono";
import { ReceiptsController } from "../controllers/receipts/receipts.controller.js";

const receiptsRouter = new Hono();

// Create receipt
receiptsRouter.post("/", async (c) => {
  try {
    const result = await ReceiptsController.create(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Update receipt
receiptsRouter.put("/:id", async (c) => {
  try {
    const result = await ReceiptsController.update(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Delete receipt
receiptsRouter.delete("/:id", async (c) => {
  try {
    const result = await ReceiptsController.delete(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// Get receipt by ID
receiptsRouter.get("/:id", async (c) => {
  try {
    const result = await ReceiptsController.get(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

// List receipts (max 30)
receiptsRouter.get("/", async (c) => {
  try {
    const result = await ReceiptsController.list(c.req);
    return c.json({ success: true, data: result });
  } catch (err: any) {
    return c.json({ success: false, message: err.message }, 403);
  }
});

export default receiptsRouter;
