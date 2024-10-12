const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/miniproject")
    .then(() => { console.log("connected to db") })
    .catch((err) => { console.log("Could not connect to db: ", err.message) });

// User Schema Definition
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    age: Number,
    email: String,
    password: String,
    profilePicture: {
        type: String,
        default: "default.png"
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }] 
});

module.exports = mongoose.model('User', userSchema); 
