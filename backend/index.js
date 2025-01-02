import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from './routes/user.route.js'
import path from 'path'
dotenv.config({});
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join('./uploads')));

app.get('/', (_, res)=>{
    return res.status(200).json({
        message: "I'm coming from backend",
        success: true
    })
})

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOption));

app.use('/api/v2/user', userRoute);

app.listen(PORT,()=>{
    connectDB();
    console.log(`server is listening at http://localhost:${PORT}`);
})