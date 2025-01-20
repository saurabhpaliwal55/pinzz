import express from "express"
import  cookieParser  from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(cors()); // for testing only after that origin is deployed domain
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello from server");
})

//importing routes
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRoter from "./routes/message.route.js"

//routes declration
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRoter)

export {app};