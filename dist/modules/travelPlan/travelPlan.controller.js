"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelPlanControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const travelPlan_service_1 = require("./travelPlan.service");
const travelPlan_model_1 = require("./travelPlan.model");
const createTravelPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await travelPlan_service_1.TravelPlanServices.createTravelPlan(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Travel plan created successfully",
        data: result,
    });
});
const getAllTravelPlans = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await travelPlan_service_1.TravelPlanServices.getAllTravelPlans();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Travel plans retrieved successfully",
        data: result,
    });
});
const getMyTravelPlans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await travelPlan_service_1.TravelPlanServices.getMyTravelPlans(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My travel plans retrieved successfully",
        data: result,
    });
});
const getSingleTravelPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await travelPlan_service_1.TravelPlanServices.getSingleTravelPlan(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Travel plan retrieved successfully",
        data: result,
    });
});
const updateTravelPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await travelPlan_service_1.TravelPlanServices.updateTravelPlan(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Travel plan updated successfully",
        data: result,
    });
});
const deleteTravelPlan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await travelPlan_service_1.TravelPlanServices.deleteTravelPlan(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Travel plan deleted successfully",
        data: null,
    });
});
const matchTravelPlans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Build query from URL params
    const query = {
        destination: req.query.destination?.toString(),
        startDate: req.query.startDate?.toString(),
        endDate: req.query.endDate?.toString(),
        travelType: req.query.travelType?.toString(),
        minBudget: req.query.minBudget?.toString(),
        maxBudget: req.query.maxBudget?.toString(),
    };
    // Call service method
    const result = await travelPlan_service_1.TravelPlanServices.matchTravelPlans(query, req.user // make sure req.user is populated by your auth middleware
    );
    // Return JSON response
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Matching travel plans retrieved successfully",
        data: result,
    });
});
const getPublicTravelPlans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { country, city, startDate, endDate, travelType } = req.query;
    // Build query object
    const query = { isPublic: true };
    if (country)
        query["destination.country"] = country;
    if (city)
        query["destination.city"] = city;
    if (travelType)
        query["travelType"] = travelType;
    // Filter by date range if provided
    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }
    const publicPlans = await travelPlan_model_1.TravelPlan.find(query)
        .populate("user", "name email") // show host info
        .sort({ startDate: 1 }); // soonest trips first
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Public travel plans retrieved successfully",
        data: publicPlans,
    });
});
exports.TravelPlanControllers = {
    createTravelPlan,
    getAllTravelPlans,
    getMyTravelPlans,
    getSingleTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    matchTravelPlans,
    getPublicTravelPlans,
};
