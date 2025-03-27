import { getAnnouncements, getAnnouncementsByAdvisor, getAnnouncementsByStudent } from '../services/announcementService';
import express, { Response, Request } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getStudentByUserId } from '../services/studentService'
import { checkAdvisor } from '../services/advisorService';

const router = express.Router();

router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userData = req.user;
    const userId = userData?.userId ? parseInt(userData?.userId) : 0
    if (userData?.role.toLowerCase() == "student") {
      const studentById = await getStudentByUserId(userId)
      const studentId = studentById?.id ?? 0;
      const advisorId = studentById?.profile?.Student?.advisorId ?? 0;
      const announcement = await getAnnouncementsByStudent(studentId, advisorId)
      return res.status(200).json({
        announcement
      });
    } else if (userData?.role.toLowerCase() == "advisor") {
      const advisorById = await checkAdvisor(userId);
      const announcement = await getAnnouncementsByAdvisor(advisorById.id)
      return res.status(200).json({
        announcement
      });
    }

    const announcement = await getAnnouncements()
    return res.status(200).json({
      announcement
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Error get all announcement.');
  }
});

export default router;
