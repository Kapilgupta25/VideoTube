import  express  from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

    //--------------- All middleware -------------------- 

// cross origin resource sharing to allow the request from the frontend to the backend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// to handle json data
app.use(express.json({limit: '15kb'}));
// to handle url encoded data
app.use(express.urlencoded({extended: true, limit: '15kb'}));
// to temperory store the cookies on the browser for the user 
app.use(express.static("public"));
// to parse the cookies
app.use(cookieParser());


// -------------- Import and declare routes --------------------


// Import routes
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";


// declare routes
app.use('/api/v1/user', userRoutes);                             // http://localhost:5000/api/v1/user/register
app.use('/api/v1/video', videoRoutes);


export default app;