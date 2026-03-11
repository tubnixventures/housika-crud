import { createChatController } from "./createChat.controller.js";
import { updateChatController } from "./updateChat.controller.js";
import { deleteChatController } from "./deleteChat.controller.js";
import { getChatController } from "./getChat.controller.js";
import { listChatsController } from "./listChats.controller.js";

export const ChatsController = {
  create: createChatController,
  update: updateChatController,
  delete: deleteChatController,
  get: getChatController,
  list: listChatsController,
};
