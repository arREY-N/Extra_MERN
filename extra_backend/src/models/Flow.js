import mongoose from "mongoose";

const flowSchema = mongoose.Schema(
    {
        flowName: {
            type: String,
            required: [true, 'Please include a valid flow name'],
            trim: true,
            unique: true,
            minlength: [3, 'Flow name must be at least 3 characters']
        }
    },{ timestamps: true }
)

flowSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    }
});

const Flow = mongoose.model('Flow', flowSchema);

export default Flow;