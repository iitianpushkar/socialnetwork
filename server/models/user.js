const mongoose=require("mongoose")
const {Schema}= mongoose
const userschema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true

    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:20
    },
    username:{
type:String,
unique:true,
required:true,
    },
    about:{
        type:String,
    },
    image: {
        url: String,
        public_id: String
    },
    following:[{type:Schema.ObjectId,ref:'User'}],
    followers:[{type:Schema.ObjectId,ref:'User'}]
},{timestamps:true})

module.exports=mongoose.model('User',userschema);