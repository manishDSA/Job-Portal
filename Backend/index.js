import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import prisma from "./utils/prisma.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import JobRouter from "./routes/jobRoute.js";
import appicationRouter from "./routes/applicationRoute.js";
import aiRouter from "./routes/aiRoute.js";

dotenv.config({});

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Portal API is running",
    });
});

// API routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", JobRouter);
app.use("/api/v1/application", appicationRouter);
app.use("/api/v1/ai", aiRouter);

app.listen(PORT, async () => {
    // Connect to PostgreSQL using pg Client
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
