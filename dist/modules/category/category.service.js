"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const category_model_1 = require("./category.model");
const createCategory = async (payload) => {
    return await category_model_1.Category.create(payload);
};
const getAllCategories = async () => {
    return await category_model_1.Category.find({ isDeleted: false });
};
const updateCategory = async (id, payload) => {
    return await category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
};
const deleteCategory = async (id) => {
    return await category_model_1.Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
exports.CategoryServices = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
