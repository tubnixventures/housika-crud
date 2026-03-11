import { createUserController } from "./createUser.controller.js";
import { updateUserController } from "./updateUser.controller.js";
import { deleteUserController } from "./deleteUser.controller.js";
import { getUserController } from "./getUser.controller.js";
import { listUsersController } from "./listUsers.controller.js";

// New endpoints
import { profileController } from "./profileController.js";
import { upgradeUserController } from "./upgradeController.js";
import { verifyUpgradeController } from "./verifyUpgradeController.js";
import { resendOtpController } from "./resendOtpController.js";

export const UsersController = {
  create: createUserController,
  update: updateUserController,
  delete: deleteUserController,
  get: getUserController,
  list: listUsersController,

  // New endpoints
  profile: profileController,
  upgrade: upgradeUserController,
  verifyUpgrade: verifyUpgradeController,
  resendOtp: resendOtpController,
};
