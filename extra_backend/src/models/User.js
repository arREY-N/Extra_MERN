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
            minlength: [6, 'Password must be at least 6 characters']
        }
    },{ timestamps: true }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }

    const salt = await genSalt(10);

    this.password = bcrypt.hash(this.password, salt);
    
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;