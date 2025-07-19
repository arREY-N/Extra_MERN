import mongoose from "mongoose";
import bcrypt, { genSalt } from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [4, 'Username must be at least 4 characters.']
        },
        password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        }
    },{ timestamps: true }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }

    const salt = await genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    
    console.log("Password hashed:", this.password);
    
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
})

const User = mongoose.model('User', userSchema);

export default User;