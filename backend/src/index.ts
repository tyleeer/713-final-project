import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import uploadRoute from './routes/uploadRoute';
import studentRoute from './routes/studentRoute'
import authRoute from './routes/authRoute';
import advisorRoute from './routes/advisorRoute';
dotenv.config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authRoute);
app.use('/upload', uploadRoute);
app.use('/student', studentRoute);
app.use('/advisor', advisorRoute);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


