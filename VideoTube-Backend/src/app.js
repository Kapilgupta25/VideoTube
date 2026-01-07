import  express  from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

    //--------------- All middleware -------------------- 

// cross origin resource sharing to allow the request from the frontend to the backend
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Use
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
import subscriptionRoutes from "./routes/subscription.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


// declare routes
app.use('/api/v1/user', userRoutes);                          
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/tweet', tweetRoutes);
app.use('/api/v1/playlist', playlistRoutes);
app.use('/api/v1/likes', likesRoutes);      
app.use('/api/v1/comment', commentRoutes);           
app.use('/api/v1/healthcheck', healthCheckRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);  


export default app;
