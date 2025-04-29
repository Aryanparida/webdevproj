const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
    }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
