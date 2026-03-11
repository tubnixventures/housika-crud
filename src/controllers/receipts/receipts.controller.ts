import { createReceiptController } from "./createReceipt.controller.js";
import { updateReceiptController } from "./updateReceipt.controller.js";
import { deleteReceiptController } from "./deleteReceipt.controller.js";
import { getReceiptController } from "./getReceipt.controller.js";
import { listReceiptsController } from "./listReceipts.controller.js";

export const ReceiptsController = {
  create: createReceiptController,
  update: updateReceiptController,
  delete: deleteReceiptController,
  get: getReceiptController,
  list: listReceiptsController,
};
