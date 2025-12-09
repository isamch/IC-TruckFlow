import user from "../models/user.model.js";
import { hashPassword } from "../utils/hashing.js";


export const createFakeadmin = async () => {

  const hashedPass = await hashPassword(process.env.ADMIN_PASSWORD);

  const item = new user({

    fullname: process.env.ADMIN_FULLNAME,
    email: process.env.ADMIN_EMAIL,
    passwordHash: hashedPass,
    role: "admin",
    isActive: true,

  });

  await item.save();
  return item;
};
