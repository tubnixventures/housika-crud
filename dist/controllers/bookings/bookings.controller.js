import { createBookingController } from "./createBooking.controller.js";
import { updateBookingController } from "./updateBooking.controller.js";
import { deleteBookingController } from "./deleteBooking.controller.js";
import { getBookingController } from "./getBooking.controller.js";
import { listBookingsController } from "./listBookings.controller.js";
export const BookingsController = {
    create: createBookingController,
    update: updateBookingController,
    delete: deleteBookingController,
    get: getBookingController,
    list: listBookingsController,
};
