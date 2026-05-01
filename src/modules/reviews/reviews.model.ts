import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    reviewer: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index(
  { reviewer: 1, course: 1 },
  { unique: true }
);

export const Review = model("Review", reviewSchema);
