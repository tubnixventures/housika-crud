import { createMessageController } from "./createMessage.controller.js";
import { updateMessageController } from "./updateMessage.controller.js";
import { deleteMessageController } from "./deleteMessage.controller.js";
import { getMessageController } from "./getMessage.controller.js";
import { listMessagesController } from "./listMessages.controller.js";
export const MessagesController = {
    create: createMessageController,
    update: updateMessageController,
    delete: deleteMessageController,
    get: getMessageController,
    list: listMessagesController,
};
