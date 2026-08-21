const express=require("express")
const {RegisterUser,LoginUser, Logout, ForgetPassword, resetPassword, getUserdetails}=require("../Controllers/user")
const {AuthenticatedUser,AuthorizeRoles}=require("../middleware/auth")
const router=express.Router()

router.post("/register",RegisterUser)

router.post("/login",LoginUser)

router.get("/logout",Logout)

router.post("/password/forgot",ForgetPassword)

router.put("/password/reset/:token",resetPassword)

router.get("/me",AuthenticatedUser,getUserdetails)

module.exports=router;
