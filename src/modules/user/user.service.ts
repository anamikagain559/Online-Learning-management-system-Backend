import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, IAuthProvider, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const exists = await User.findOne({ email });
    if (exists) throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");

    const hashedPassword = password ? await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND)) : undefined;
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User Not Found");

    // Only admin can change role/isActive/isDeleted
    if (payload.role || payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return updatedUser;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return { data: users, meta: { total: totalUsers } };
};

const getInstructors = async () => {
    return await User.find({ role: Role.INSTRUCTOR }).select("name email picture");
};

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return { data: user };
};
const updateMyProfile = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // Remove sensitive fields
  delete payload.role;
  delete payload.isActive;
  delete payload.isDeleted;
  delete payload.auths;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true }
  ).select("-password");

  return updatedUser;
};



export const UserServices = { createUser, updateUser, getAllUsers, getInstructors, getMe, updateMyProfile };
