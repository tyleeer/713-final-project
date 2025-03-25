import express, { Request, Response } from "express"
import multer from 'multer';
import { uploadFile } from '../services/uploadFileService'

const router: express.Router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });
const bucket = process.env.SUPABASE_BUCKET_NAME;

router.post('/profile', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = "profile";

        if (!bucket || !filePath) {
            return res.status(500).json({ message: 'Bucket name or file path not configured.' });
        }

        const ouputUrl = await uploadFile(bucket, filePath, file);
        res.status(200).json({ url: ouputUrl });
    } catch (error: any) {
        res.status(500).json({ message: error?.message });
    }
});

router.post('/announcement', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = "announcement";

        if (!bucket || !filePath) {
            return res.status(500).send('Bucket name or file path not configured.');
        }

        const ouputUrl = await uploadFile(bucket, filePath, file);
        res.status(200).send(ouputUrl);
    } catch (error) {
        res.status(500).send('Error uploading file.');
    }
});

export default router