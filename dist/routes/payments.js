import { Hono } from "hono";
import { PaymentsController } from "../controllers/payments/payments.controller.js";
const paymentsRouter = new Hono();
// Create payment
paymentsRouter.post("/", async (c) => {
    try {
        const result = await PaymentsController.create(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Update payment
paymentsRouter.put("/:id", async (c) => {
    try {
        const result = await PaymentsController.update(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Delete payment
paymentsRouter.delete("/:id", async (c) => {
    try {
        const result = await PaymentsController.delete(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Get payment by ID
paymentsRouter.get("/:id", async (c) => {
    try {
        const result = await PaymentsController.get(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// List payments (max 30)
paymentsRouter.get("/", async (c) => {
    try {
        const result = await PaymentsController.list(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Paystack webhook (no JWT, signature validation only)
paymentsRouter.post("/webhook", async (c) => {
    try {
        const result = await PaymentsController.webhook(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 400);
    }
});
// Paystack callback (after redirect)
paymentsRouter.get("/callback", async (c) => {
    try {
        const result = await PaymentsController.callback(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 400);
    }
});
export default paymentsRouter;
