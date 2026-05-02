"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const exists = await user_model_1.User.findOne({ email });
    if (exists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    const hashedPassword = password ? await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND)) : undefined;
    const authProvider = { provider: "credentials", providerId: email };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });
    return user;
};
const updateUser = async (userId, payload, decodedToken) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    // Only admin can change role/isActive/isDeleted
    if (payload.role || payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return updatedUser;
};
const getAllUsers = async () => {
    const users = await user_model_1.User.find({});
    const totalUsers = await user_model_1.User.countDocuments();
    return { data: users, meta: { total: totalUsers } };
};
const getInstructors = async () => {
    return await user_model_1.User.find({ role: user_interface_1.Role.INSTRUCTOR }).select("name email picture");
};
const getMe = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("-password");
    return { data: user };
};
const updateMyProfile = async (userId, payload) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    // Remove sensitive fields
    delete payload.role;
    delete payload.isActive;
    delete payload.isDeleted;
    delete payload.auths;
    const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { $set: payload }, { new: true, runValidators: true }).select("-password");
    return updatedUser;
};
exports.UserServices = { createUser, updateUser, getAllUsers, getInstructors, getMe, updateMyProfile };
