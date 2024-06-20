const mongoose=require("mongoose")

const messageSchema= new mongoose.Schema({
    conversationid:{
        type:String,
    },
    senderid:{
        type:String,
    },
    message:{
        type:String,
    },


})

const messages=mongoose.model("message",messageSchema)

module.exports=messages