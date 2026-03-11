import { createBannerController } from "./createBanner.controller.js";
import { updateBannerController } from "./updateBanner.controller.js";
import { deleteBannerController } from "./deleteBanner.controller.js";
import { getBannerController } from "./getBanner.controller.js";
import { listBannersController } from "./listBanners.controller.js";
export const BannersController = {
    create: createBannerController,
    update: updateBannerController,
    delete: deleteBannerController,
    get: getBannerController,
    list: listBannersController,
};
