import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectToDB from './config/db.js';
import { PORT, NODE_ENV, APP_ORIGIN } from './constants/env.js';
import errorHandler from './middleware.js/errorHandler.js';
import catchErrors from './utils/catchErrors.js';
import { OK } from './constants/http.js';
import authRoutes from './routes/auth.route.js';
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
app.get('/',(req, res, next) => {
    return res.status(OK).json({
        status:"Healthy",
    });

    });

app.use('/auth',authRoutes);
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT} in ${NODE_ENV} environment`);
    await connectToDB();
    }
    
    
);
