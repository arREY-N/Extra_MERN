import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: [3, 'Category name must be at least 3 characters']
        },
        color: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [
                /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
                'Color value must be a valid hexcode'
            ]
        }
    },{ timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;