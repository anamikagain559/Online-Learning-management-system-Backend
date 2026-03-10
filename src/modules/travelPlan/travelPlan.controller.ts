import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TravelPlanServices } from "./travelPlan.service";
import { TravelPlan } from "./travelPlan.model";
const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelPlanServices.createTravelPlan(
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Travel plan created successfully",
    data: result,
  });
});

const getAllTravelPlans = catchAsync(async (_req, res) => {
  const result = await TravelPlanServices.getAllTravelPlans();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plans retrieved successfully",
    data: result,
  });
});

const getMyTravelPlans = catchAsync(async (req, res) => {
  const result = await TravelPlanServices.getMyTravelPlans(
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My travel plans retrieved successfully",
    data: result,
  });
});

const getSingleTravelPlan = catchAsync(async (req, res) => {
  const result = await TravelPlanServices.getSingleTravelPlan(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan retrieved successfully",
    data: result,
  });
});

const updateTravelPlan = catchAsync(async (req, res) => {
  const result = await TravelPlanServices.updateTravelPlan(
    req.params.id,
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan updated successfully",
    data: result,
  });
});

const deleteTravelPlan = catchAsync(async (req, res) => {
  await TravelPlanServices.deleteTravelPlan(
    req.params.id,
    req.user as JwtPayload & { userId: string; role: string }
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan deleted successfully",
    data: null,
  });
});
const matchTravelPlans = catchAsync(async (req: Request, res: Response) => {
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
  const result = await TravelPlanServices.matchTravelPlans(
    query,
    req.user as JwtPayload // make sure req.user is populated by your auth middleware
  );

  // Return JSON response
  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Matching travel plans retrieved successfully",
    data: result,
  });
});

const getPublicTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const { country, city, startDate, endDate, travelType } = req.query;

  // Build query object
  const query: any = { isPublic: true };

  if (country) query["destination.country"] = country;
  if (city) query["destination.city"] = city;
  if (travelType) query["travelType"] = travelType;

  // Filter by date range if provided
  if (startDate && endDate) {
    query.startDate = { $gte: new Date(startDate as string) };
    query.endDate = { $lte: new Date(endDate as string) };
  }

  const publicPlans = await TravelPlan.find(query)
    .populate("user", "name email") // show host info
    .sort({ startDate: 1 }); // soonest trips first

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Public travel plans retrieved successfully",
    data: publicPlans,
  });
});
export const TravelPlanControllers = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelPlans,
  getPublicTravelPlans,
};
