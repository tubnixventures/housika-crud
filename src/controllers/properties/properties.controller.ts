import { createPropertyController } from "./createProperty.controller.js";
import { updatePropertyController } from "./updateProperty.controller.js";
import { deletePropertyController } from "./deleteProperty.controller.js";
import { getPropertyController } from "./getProperty.controller.js";
import { listPropertiesController } from "./listProperties.controller.js";

export const PropertiesController = {
  create: createPropertyController,
  update: updatePropertyController,
  delete: deletePropertyController,
  get: getPropertyController,
  list: listPropertiesController,
};
