const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/miniproject").then(()=>{console.log("connected to db")}).catch((err)=>{console.log("Could not connect to db: ",err.message)})

const userSchema=mongoose.Schema({
    name:String,
    username:String,
    age:Number,
    email:String,
    password:String,
    profilePicture:{
        type:String,
        default:"default.png"
    },
    posts:[{type:mongoose.Types.ObjectId,ref:"post"}]
})

module.exports=mongoose.model('user',userSchema);