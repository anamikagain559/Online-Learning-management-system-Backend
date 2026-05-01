export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ICourse {
  category: string; // Title
  categoryId: string;
  instructorId: string;
  user: string; // The person who created it
  startDate: Date;
  endDate: Date;
  price: number;
  courseLevel: CourseLevel;
  description?: string;
  isPublic?: boolean;
  image?: string;
}
