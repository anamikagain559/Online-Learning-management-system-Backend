import { Types } from "mongoose";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ICourse {
  category: string; // Title
  categoryId: Types.ObjectId;
  instructorId: Types.ObjectId;
  user: Types.ObjectId; // The person who created it
  startDate: Date;
  endDate: Date;
  price: number;
  courseLevel: CourseLevel;
  description?: string;
  isPublic?: boolean;
  image?: string;
}
