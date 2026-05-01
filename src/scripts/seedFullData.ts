import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcryptjs from "bcryptjs";

// Load env
dotenv.config({ path: path.join(process.cwd(), ".env") });

const DB_URL = process.env.DB_URL;

// Define Schemas Locally to ensure they are registered for the script
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["ADMIN", "STUDENT", "INSTRUCTOR", "USER"], default: "USER" },
    picture: { type: String },
    bio: { type: String, default: "" },
    isActive: { type: String, enum: ["active", "blocked"], default: "active" },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
    category: { type: String, required: true }, // Title
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    courseLevel: { type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"], required: true },
    description: { type: String },
    image: { type: String },
    isPublic: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

async function seed() {
  if (!DB_URL) {
    console.error("DB_URL not found in .env");
    return;
  }

  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcryptjs.hash("123456", 10);

    // 1. Create Instructors
    const instructorsData = [
      {
        name: "Dr. Sarah Mitchell",
        email: "sarah@learnhub.com",
        password: hashedPassword,
        role: "INSTRUCTOR",
        picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        bio: "Senior Full Stack Architect with 15+ years of experience in React and Node.js.",
        isActive: "active",
        isVerified: true
      },
      {
        name: "James Wilson",
        email: "james@learnhub.com",
        password: hashedPassword,
        role: "INSTRUCTOR",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        bio: "Data Scientist at Google. Passionate about AI, ML and Big Data Analytics.",
        isActive: "active",
        isVerified: true
      },
      {
        name: "Emily Chen",
        email: "emily@learnhub.com",
        password: hashedPassword,
        role: "INSTRUCTOR",
        picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        bio: "Award-winning UI/UX Designer specialized in product design and user research.",
        isActive: "active",
        isVerified: true
      }
    ];

    const instructors = [];
    for (const data of instructorsData) {
      const user = await User.findOneAndUpdate(
        { email: data.email },
        data,
        { upsert: true, new: true }
      );
      instructors.push(user);
    }
    console.log("Instructors seeded");

    // 2. Create Students
    const studentsData = [
      {
        name: "Alex Rivera",
        email: "alex@student.com",
        password: hashedPassword,
        role: "STUDENT",
        picture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
        isActive: "active"
      },
      {
        name: "Sophie Taylor",
        email: "sophie@student.com",
        password: hashedPassword,
        role: "STUDENT",
        picture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
        isActive: "active"
      }
    ];

    for (const data of studentsData) {
      await User.findOneAndUpdate(
        { email: data.email },
        data,
        { upsert: true, new: true }
      );
    }
    console.log("Students seeded");

    // 3. Get Categories
    const categoriesList = await Category.find({});
    const webDevCat = categoriesList.find(c => c.name === "Web Development");
    const dataSciCat = categoriesList.find(c => c.name === "Data Science");
    const uiuxCat = categoriesList.find(c => c.name === "UI/UX Design");

    // 4. Create Courses
    const coursesData = [
      {
        category: "Full Stack Web Mastery",
        categoryId: webDevCat?._id,
        instructorId: instructors.find(i => i.email === "sarah@learnhub.com")?._id,
        user: instructors[0]._id, // Admin creator
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-01"),
        price: 199,
        courseLevel: "INTERMEDIATE",
        description: "Master React, Next.js, TypeScript, and Node.js with real-world enterprise projects.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        isPublic: true
      },
      {
        category: "Advanced Machine Learning",
        categoryId: dataSciCat?._id,
        instructorId: instructors.find(i => i.email === "james@learnhub.com")?._id,
        user: instructors[0]._id,
        startDate: new Date("2024-07-15"),
        endDate: new Date("2025-01-15"),
        price: 299,
        courseLevel: "ADVANCED",
        description: "Deep dive into Neural Networks, Natural Language Processing, and Computer Vision.",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
        isPublic: true
      },
      {
        category: "UI/UX Fundamentals",
        categoryId: uiuxCat?._id,
        instructorId: instructors.find(i => i.email === "emily@learnhub.com")?._id,
        user: instructors[0]._id,
        startDate: new Date("2024-05-20"),
        endDate: new Date("2024-08-20"),
        price: 99,
        courseLevel: "BEGINNER",
        description: "Learn Figma, Design Systems, and User Research from scratch to build stunning apps.",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
        isPublic: true
      }
    ];

    for (const data of coursesData) {
      if (data.categoryId) {
        await Course.findOneAndUpdate(
          { category: data.category },
          data,
          { upsert: true, new: true }
        );
      }
    }
    console.log("Courses seeded");

    console.log("Seeding completed successfully! Default password for all: 123456");

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
