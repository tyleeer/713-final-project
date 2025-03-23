import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import uploadRoute from './routes/uploadRoute';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/upload', uploadRoute);

const port = 3000;


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
