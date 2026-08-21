const { User } = require("../Models/user");
const { ErrorHandler } = require("../util/errorhandler")
const jwt = (require("jsonwebtoken"))

async function AuthenticatedUser(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }
    const decodedata = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedata.id)

    next();

};

const AuthorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};
module.exports = {
    AuthenticatedUser,
    AuthorizeRoles,
}