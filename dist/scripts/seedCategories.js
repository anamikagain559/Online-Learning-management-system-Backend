"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const DB_URL = process.env.DB_URL;
const categories = [
    {
        name: "Web Development",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    },
    {
        name: "UI/UX Design",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    },
    {
        name: "Data Science",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=600&q=80",
    },
    {
        name: "Digital Marketing",
        image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80",
    },
    {
        name: "Business Strategy",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    },
    {
        name: "Photography",
        image: "https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=600&q=80",
    },
];
async function seed() {
    if (!DB_URL) {
        console.error("DB_URL not found in .env");
        return;
    }
    try {
        await mongoose_1.default.connect(DB_URL);
        console.log("Connected to MongoDB");
        // Define temporary schema to avoid importing model which might have issues in script
        const CategorySchema = new mongoose_1.default.Schema({
            name: String,
            image: String,
            isDeleted: { type: Boolean, default: false }
        }, { timestamps: true });
        const Category = mongoose_1.default.models.Category || mongoose_1.default.model("Category", CategorySchema);
        // Clear existing (optional, but requested to "add" these)
        // For safety, let's just insert if not exists
        for (const cat of categories) {
            await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
        }
        console.log("Categories seeded successfully!");
    }
    catch (error) {
        console.error("Seeding failed:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
    }
}
seed();
