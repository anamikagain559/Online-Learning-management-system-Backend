import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { TravelPlan } from "./travelPlan.model";
import { ITravelPlan } from "./travelPlan.interface";

const createTravelPlan = async (
  payload: ITravelPlan,
  decodedToken: JwtPayload
) => {
  return await TravelPlan.create({
    ...payload,
    user: decodedToken.userId,
    isActive: true,
  });
};

const getAllTravelPlans = async () => {
  return await TravelPlan.find({
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
};

const getMyTravelPlans = async (decodedToken: JwtPayload) => {
  return await TravelPlan.find({ user: decodedToken.userId });
};

const getSingleTravelPlan = async (id: string) => {
  const plan = await TravelPlan.findById(id).populate(
    "user",
    "name email"
  );

  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  return plan;
};

const updateTravelPlan = async (
  id: string,
  payload: Partial<ITravelPlan>,
  decodedToken: JwtPayload
) => {
  const plan = await TravelPlan.findById(id);

  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  if (plan.user.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can update only your own travel plan"
    );
  }

  const updated = await TravelPlan.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  return updated;
};

const deleteTravelPlan = async (
  id: string,
  decodedToken: JwtPayload & { userId: string; role: string } // make sure role is included
) => {
  const plan = await TravelPlan.findById(id);

  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  // Admin can delete any plan
  if (decodedToken.role !== "ADMIN" && plan.user.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can delete only your own travel plan"
    );
  }

  await TravelPlan.findByIdAndDelete(id);
  return null;
};


const matchTravelPlans = async (query: any, decoded: JwtPayload) => {
  const { destination, startDate, endDate, travelType, minBudget, maxBudget } = query;

  const baseFilter: any = {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
    // user: { $ne: decoded.userId }, // 🛠 Temporarily allowed for testing visibility
  };

  const orConditions: any[] = [];

  // Match destination city or country (OR)
  if (destination && destination.trim() !== "") {
    const words = destination.trim().split(/\s+/).filter((w: string) => w.length > 0);
    const searchPattern = words.join('|'); // Matches any of the words
    orConditions.push({
      $or: [
        { "destination.city": { $regex: searchPattern, $options: "i" } },
        { "destination.country": { $regex: searchPattern, $options: "i" } },
      ],
    });
  }

  // Match date overlap (OR)
  if (startDate && endDate && startDate !== "" && endDate !== "") {
    orConditions.push({
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });
  }

  // Match travel type (OR)
  if (travelType && travelType !== "" && travelType !== "ALL") {
    orConditions.push({
      travelType: travelType.toUpperCase(),
    });
  }

  // Match Budget Range (OR)
  if (minBudget && minBudget !== "") {
    orConditions.push({
      "budgetRange.min": { $gte: Number(minBudget) },
    });
  }
  if (maxBudget && maxBudget !== "") {
    orConditions.push({
      "budgetRange.max": { $lte: Number(maxBudget) },
    });
  }

  // Final Query: Base Filter (AND) (OR Conditions)
  const finalQuery = orConditions.length > 0
    ? { $and: [baseFilter, { $or: orConditions }] }
    : baseFilter;

  console.log("FINAL BROAD MATCH FILTER 👉", JSON.stringify(finalQuery, null, 2));

  return TravelPlan.find(finalQuery)
    .populate("user", "name email picture bio")
    .sort({ startDate: 1 });
};

export const TravelPlanServices = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelPlans,
};
