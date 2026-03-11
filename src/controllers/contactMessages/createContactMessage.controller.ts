import { createContactMessageModel } from "../../models/contactMessages/createContactMessage.model.js";

export async function createContactMessageController(req: any) {
  // Public endpoint — no JWT required
  return await createContactMessageModel(req.body);
}
