import { Hono } from "hono";
import { UsersController } from "../controllers/users/users.controller.js";
const usersRouter = new Hono();
// Create user
usersRouter.post("/", async (c) => {
    try {
        const result = await UsersController.create(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Update user
usersRouter.put("/:id", async (c) => {
    try {
        const result = await UsersController.update(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Delete user
usersRouter.delete("/:id", async (c) => {
    try {
        const result = await UsersController.delete(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Get user by identifier (id/email/phone)
usersRouter.get("/:identifier", async (c) => {
    try {
        const result = await UsersController.get(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// List users (max 30, visibility enforced)
usersRouter.get("/", async (c) => {
    try {
        const result = await UsersController.list(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// --- New Endpoints ---
// Get own profile
usersRouter.get("/profile/me", async (c) => {
    try {
        const result = await UsersController.profile(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Upgrade account
usersRouter.post("/upgrade", async (c) => {
    try {
        const result = await UsersController.upgrade(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Verify upgrade with OTP
usersRouter.post("/upgrade/verify", async (c) => {
    try {
        const result = await UsersController.verifyUpgrade(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
// Resend OTP for upgrade verification
usersRouter.post("/upgrade/resend-otp", async (c) => {
    try {
        const result = await UsersController.resendOtp(c.req);
        return c.json({ success: true, data: result });
    }
    catch (err) {
        return c.json({ success: false, message: err.message }, 403);
    }
});
export default usersRouter;
