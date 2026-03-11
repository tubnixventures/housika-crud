import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import usersRouter from "./routes/users.js";
import bannersRouter from "./routes/banners.js";
import propertiesRouter from "./routes/properties.js";
import roomsRouter from "./routes/rooms.js";
import bookingsRouter from "./routes/bookings.js";
import receiptsRouter from "./routes/receipts.js";
import paymentsRouter from "./routes/payments.js";
import contactMessagesRouter from "./routes/contactMessages.js";
import chatsRouter from "./routes/chats.js";
import messagesRouter from "./routes/messages.js";
const app = new Hono();
// --- Global Middleware ---
app.use("*", logger()); // structured logging
app.use("*", prettyJSON()); // pretty JSON for debugging
// CORS with dynamic origin control
app.use("*", cors({
    origin: (origin) => {
        if (!origin)
            return "*"; // allow non-browser requests
        if (origin.startsWith("http://localhost"))
            return origin;
        if (origin.startsWith("http://127.0.0.1"))
            return origin;
        // extend with allowlist from env config
        return "null";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// --- Health & Diagnostics ---
app.get("/health", (c) => c.json({ status: "ok", uptime: process.uptime() }));
app.get("/metrics", (c) => c.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    pid: process.pid,
}));
// --- Root ---
app.get("/", (c) => c.text("Housika API Gateway is alive 🚀"));
// --- Sub-Routers ---
app.route("/users", usersRouter);
app.route("/banners", bannersRouter);
app.route("/properties", propertiesRouter);
app.route("/rooms", roomsRouter);
app.route("/bookings", bookingsRouter);
app.route("/receipts", receiptsRouter);
app.route("/payments", paymentsRouter);
app.route("/contact-messages", contactMessagesRouter);
app.route("/chats", chatsRouter);
app.route("/messages", messagesRouter);
// --- Global Error Handling ---
app.onError((err, c) => {
    console.error("Unhandled error:", err);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
});
// --- Self-Healing Hooks ---
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // trigger graceful shutdown or restart via orchestrator
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
// --- Graceful Shutdown ---
process.on("SIGTERM", () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    // close DB/Redis connections here
    process.exit(0);
});
// --- Start Server ---
const PORT = parseInt(process.env.PORT || "3000", 10);
serve({ fetch: app.fetch, port: PORT }, (info) => console.log(`🚀 Server running at http://localhost:${info.port}`));
