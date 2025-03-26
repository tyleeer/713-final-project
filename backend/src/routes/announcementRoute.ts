import { getAnnouncements } from '../services/announcementService';
import express, { Response } from 'express';

const router = express.Router();

router.get('/', async (_, res: Response) => {
  try {
    const announcement = await getAnnouncements()
    res.status(200).json({
      announcement
    });
  } catch (error) {
    res.status(500).send('Error creating comment.');
  }
});

export default router;
