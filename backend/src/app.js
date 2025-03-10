import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToDB from './config/db.js';
import { PORT, NODE_ENV, APP_ORIGIN } from './constants/env.js';
import errorHandler from './middleware.js/errorHandler.js';
import catchErrors from './utils/catchErrors.js';
import { OK } from './constants/http.js';
import authRoutes from './routes/auth.route.js';
import authenticate from './middleware.js/authenticate.js';
import userRoutes from './routes/user.route.js';
import sessionRoutes from './routes/session.route.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
        // methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(cookieParser());

app.get('/',(req, res, next) => {
    return res.status(OK).json({
        status:"Healthy",
    });

});

// protected routes
app.use('/user',authenticate, userRoutes);
app.use('/sessions',authenticate, sessionRoutes);

app.use('/auth',authRoutes);
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT} in ${NODE_ENV} environment`);
    await connectToDB();
    }
    
    
);
