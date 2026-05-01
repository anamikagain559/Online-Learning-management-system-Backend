import { model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  image: string;
  isDeleted?: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
