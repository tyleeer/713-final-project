import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import uploadRoute from './routes/uploadRoute';
import studentRoute from './routes/studentRoute'
import authRoute from './routes/authRoute';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/auth', authRoute);
app.use('/upload', uploadRoute);
app.use('/student', studentRoute);
const port = 3000;

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


