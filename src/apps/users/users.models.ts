import * as mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ['user', 'admin']
    }
}, {
    timestamps: true,
});

userSchema.pre("save", function (next) {
    // only update the password if it has changed
    if (!this.isModified("password")) return next();
    bcrypt.hash(this.password, 12, (err: any, hash: any) => {
        this.password = hash;
        next();
    });
});


const User = mongoose.model("users", userSchema);

export default User;