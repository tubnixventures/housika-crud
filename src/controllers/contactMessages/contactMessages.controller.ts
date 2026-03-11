import { createContactMessageController } from "./createContactMessage.controller.js";
import { updateContactMessageController } from "./updateContactMessage.controller.js";
import { deleteContactMessageController } from "./deleteContactMessage.controller.js";
import { getContactMessageController } from "./getContactMessage.controller.js";
import { listContactMessagesController } from "./listContactMessages.controller.js";

export const ContactMessagesController = {
  create: createContactMessageController,
  update: updateContactMessageController,
  delete: deleteContactMessageController,
  get: getContactMessageController,
  list: listContactMessagesController,
};
