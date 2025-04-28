import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import auth from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import callRoute from './routes/callRoute.js';
import groupRoute from './routes/groupRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import storyRouter from './routes/storyRoute.js';
import globalError  from './middlewares/errorMiddleware.js';
//import server from './socket/socket.js';

dotenv.config();
// connection to DB
connectDb();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.options('*', cors());

app.use('/api/v1/auth', auth);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/call', callRoute);
app.use('/api/v1/group', groupRoute);
app.use('/api/v1/conversation', conversationRoute);
app.use('/api/v1/story', storyRouter);


app.use('*',(req,res,next ) =>{
    next(new Error(`Can't find this route : ${req.originalUrl}`,404));
});

app.use(globalError);

const PORT = process.env.PORT;
app.listen(PORT,()=>
    {console.log(`Server is Running on Port ${PORT}`)});

process.on('unhandledRejection',(err)=>{
    console.log(`Unhandled Rejection Error: ${err}`);
    server.close(()=>{
        console.error('Server is closing...');
        process.exit(1);
    });// Exit process if unhanded rejection error occurs
})