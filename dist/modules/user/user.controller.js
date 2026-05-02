"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
// const createUserFunction = async (req: Response, res: Response) => {
//     const user = await UserServices.createUser(req.body)
//     res.status(httpStatus.CREATED).json({
//         message: "User Created Successfully",
//         user
//     })
// }
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new Error("Fake eror")
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake error")
//         // createUserFunction(req, res)
//     } catch (err: any) {
//         console.log(err);
//         next(err)
//     }
// }
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        throw new Error("User ID is required");
    }
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK, // ✅ FIXED
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});
const getInstructors = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserServices.getInstructors();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Instructors Retrieved Successfully",
        data: result
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
});
const blockOrUnblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body || {};
        if (isActive === undefined) {
            return res.status(400).json({
                success: false,
                message: "isActive is required"
            });
        }
        const updatedUser = await user_model_1.User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: `User status updated to ${isActive}`,
            data: updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
const updateMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await user_service_1.UserServices.updateMyProfile(user.userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
const getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params; // use 'id' instead of '_id'
    if (!id) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "User ID is required",
            data: null,
        });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Invalid User ID",
            data: null,
        });
    }
    const user = await user_model_1.User.findById(id).lean(); // lean() returns plain JS object
    if (!user) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "User not found",
            data: null,
        });
    }
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User retrieved successfully",
        data: { ...user, id: user._id.toString() }, // frontend-friendly id
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    getInstructors,
    updateUser,
    getMe, getUserById,
    updateMyProfile,
    blockOrUnblockUser,
};
