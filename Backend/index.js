import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from 'dotenv'
import connectDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import JobRouter from "./routes/jobRoute.js";
import appicationRouter from "./routes/applicationRoute.js";
dotenv.config({})

const app= express();
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
const corsOptions ={
    origin:'http://localhost:5173',
    credentials:true,

}
app.use(cors(corsOptions))
const PORT = process.env.PORT || 3000;

//api's
app.use("/api/v1/user",userRouter)
app.use("/api/v1/company",companyRouter)
app.use("/api/v1/job",JobRouter)
app.use("/api/v1/application",appicationRouter)







app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})