import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import { app, server } from "./socket/socket.js";
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({});
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/api/v1/user', userRoute);
app.use('/api/v1/user', postRoute);
app.use('/api/v1/message', messageRoute);

server.listen(PORT,()=>{
    connectDB();
    console.log(`server is listening at http://localhost:${PORT}`);
})