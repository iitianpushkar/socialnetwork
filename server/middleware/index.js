const {expressjwt}=require("express-jwt")

const requiresignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"]
})

module.exports=requiresignin