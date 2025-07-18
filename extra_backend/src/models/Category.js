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

categorySchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.createdAt;
        return ret;
    }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;