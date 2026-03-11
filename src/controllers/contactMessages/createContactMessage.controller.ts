import { createContactMessageModel } from "../../models/contactMessages/createContactMessage.model.js";
import { verifyCaptcha } from "../../utils/captcha.js";
import { getSession, setSession } from "../../utils/redis.js";

export async function createContactMessageController(req: any) {
  // Public endpoint — no JWT required

  const clientIp = req.headers["x-forwarded-for"] || req.ip; // identify user
  const firstContactKey = `first_contact_${clientIp}`;

  // Step 1: Check if this IP has already submitted a contact message
  const hasContacted = await getSession(firstContactKey);

  if (hasContacted) {
    // Require CAPTCHA for subsequent submissions
    const captchaToken = req.body.captchaToken;
    const captchaValid = await verifyCaptcha(captchaToken);

    if (!captchaValid) {
      throw new Error("CAPTCHA verification failed — possible bot traffic");
    }
  } else {
    // Mark this IP as having submitted once
    // TTL passed as a number (seconds), not an object
    await setSession(firstContactKey, "true", 86400); // expire after 1 day
  }

  // Step 2: Save the contact message
  return await createContactMessageModel(req.body);
}
