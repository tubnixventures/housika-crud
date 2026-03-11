import { createPaymentController } from "./createPayment.controller.js";
import { updatePaymentController } from "./updatePayment.controller.js";
import { deletePaymentController } from "./deletePayment.controller.js";
import { getPaymentController } from "./getPayment.controller.js";
import { listPaymentsController } from "./listPayments.controller.js";
import { paystackWebhookController } from "./paystackWebhook.controller.js";
import { paystackCallbackController } from "./paystackCallback.controller.js";
export const PaymentsController = {
    create: createPaymentController,
    update: updatePaymentController,
    delete: deletePaymentController,
    get: getPaymentController,
    list: listPaymentsController,
    webhook: paystackWebhookController,
    callback: paystackCallbackController,
};
