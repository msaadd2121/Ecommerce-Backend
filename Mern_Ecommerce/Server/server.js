const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser=require("cookie-parser")

dotenv.config({ path: "./config/config.env" });

const { ConnectionDB } = require("./Connection");

// Uncaught Exception Handler
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");

    process.exit(1);
});

ConnectionDB(process.env.DB_URL).then(() => {
    console.log("MongoDB Connected");
});

const Router = require("./routes/product");
const User = require("./routes/user");
const errorMiddleware = require("./middleware/error");

// Middleware
app.use(express.json());
app.use(cookieParser())


// Routes
app.use("/api", Router);
app.use("/api", User);

// Error Middleware - ALWAYS LAST
app.use(errorMiddleware);

// Server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started at Port: ${process.env.PORT}`);
});

// Unhandled Rejection Handler
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    });
});