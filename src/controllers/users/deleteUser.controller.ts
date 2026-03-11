import { deleteUserModel } from "../../models/users/deleteUser.model.js";
import { verifyToken } from "../../utils/jwt.js";
import { getSession } from "../../utils/redis.js";

export async function deleteUserController(req: any) {
  const token = req.headers.authorization?.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) throw new Error("Invalid token");

  const blacklisted = await getSession(`bl_${token}`);
  if (blacklisted) throw new Error("Token blacklisted");

  const targetRole = req.body.role;
  if (payload.role === targetRole || payload.role === "user") throw new Error("Not authorized to delete this role");

  return await deleteUserModel(req.params.id);
}
