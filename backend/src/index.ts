import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import uploadRoute from './routes/uploadRoute';
import studentRoute from './routes/studentRoute'
import authRoute from './routes/authRoute';
import advisorRoute from './routes/advisorRoute';
import announcementRoute from './routes/announcementRoute';
import assignmentRoute from './routes/assignmentRoute';
import commentRoute from './routes/commentRoute';
import { getProfile } from './controllers/UserController';
import { authenticateJWT } from './middleware/authMiddleware';


dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
console.log("allowedOrigins: ", allowedOrigins);
const options: cors.CorsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : false, // Prevent empty origin issue
};

app.use(cors(options));
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoute);
app.use('/upload', uploadRoute);
app.use('/student', studentRoute);
app.use('/advisor', advisorRoute);
app.use('/announcement', announcementRoute);
app.use('/assignment', assignmentRoute);
app.use('/comment', commentRoute)
app.use('/profile', authenticateJWT, getProfile)



app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


