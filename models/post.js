const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Use "User" if that's how you registered the model
    },
    date: {
        type: Date,
        default: Date.now // Use Date.now instead of Date.now()
    },
    content: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Ensure this matches your User model name
    }]
});

module.exports = mongoose.model("Post", postSchema); // Use "Post" for consistency
