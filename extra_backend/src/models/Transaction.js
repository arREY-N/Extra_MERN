import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
    {
        item: {
            type: String,
            required: [true, 'Please include an item name'],
            trim: true,
            minlength: [3, 'Item name must be at least 3 characters']
        },
        amount: {
            type: Number,
            required: [true, 'Please input a valid amount'],
            min: [0, 'Amount cannot be negative']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        flow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flow',
            required: true
        }
    },{ timestamps: true }
)

transactionSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;