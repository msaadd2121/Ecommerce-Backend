const { User } = require("../Models/user")
const { ErrorHandler } = require("../util/errorhandler");
const { sendToken } = require("../util/jwttoken");
const { sendEmail } = require("../util/sendEmail")
const crypto = require("crypto")

async function RegisterUser(req, res) {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avator: {
            public_id: "this is public_id",
            url: "profileepicurl",
        }
    });
    // const token=user.getJWTToken();
    // res.status(201).json({
    //     success: true,
    //     token,
    // })
    sendToken(user, 201, res)


}

async function LoginUser(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res)


}

//Logout
async function Logout(req, res, next) {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
};

// Forget Password

async function ForgetPassword(req, res, next) {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/password/reset/${resetToken}`;

    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });


    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))

    }

}

//ResetPassword

async function resetPassword(req, res, next) {
    const resetPasswordToken = crypto
        .createHash("sha256").update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHandler(" Reset Password Token is Invalid or been expired ", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(" Password Doesnot Match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);

}

async function getUserdetails(req,res,next){
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
};

module.exports = {
    RegisterUser,
    LoginUser,
    Logout,
    ForgetPassword,
    resetPassword,
    getUserdetails,
}
