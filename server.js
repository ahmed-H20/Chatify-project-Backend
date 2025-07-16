import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDb from './config/db.js';
import auth from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import callRoute from './routes/callRoute.js';
import groupRoute from './routes/groupRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import storyRouter from './routes/storyRoute.js';
import globalError  from './middlewares/errorMiddleware.js';
import chatbotRouter from './routes/chatbotRoute.js';
import { Server } from 'socket.io'; 
import settingsRoute from "./routes/settingsRoute.js";

//import server from './socket/socket.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

dotenv.config();
// connection to DB
connectDb();
import http from 'http';
const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],  
  credentials: true
}));
app.options('*', cors());
app.use(bodyParser.json());


app.use('/api/v1/auth', auth);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/call', callRoute);
app.use('/api/v1/group', groupRoute);
app.use('/api/v1/conversation', conversationRoute);
app.use('/api/v1/story', storyRouter);
app.use('/api/v1/chatbot',chatbotRouter);
app.use("/api/v1/settings", settingsRoute);

app.use('*',(req,res,next ) =>{
    next(new Error(`Can't find this route : ${req.originalUrl}`,404));
});

app.use(globalError);
import { setupSocketServer } from './socket/socket.js';
setupSocketServer(server);


const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

process.on('unhandledRejection',(err)=>{
    console.log(`Unhandled Rejection Error: ${err}`);
    server.close(()=>{
        console.error('Server is closing...');
        process.exit(1);
    });// Exit process if unhanded rejection error occurs
})
