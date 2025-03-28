import multer from 'multer';
import { uploadFile } from '../services/uploadFileService';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';
import { checkAdvisor, checkStudent, createAnnouncement, createComment, checkComment, createReply, getAdvisors } from '../services/advisorService';
import { getConversation } from '../services/commentService';
import express, { Request, Response } from 'express';
import { Announcement, Comment, Reply } from '../models/types';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const bucket = process.env.SUPABASE_BUCKET_NAME;

router.get('/', async (_, res: Response) => {
  try {
    const advisor = await getAdvisors()
    res.status(200).json({
      advisor
    });
  } catch (error) {
    res.status(500).send('Error get all advisors.');
  }
});


router.get('/comment', async (req: Request, res: Response) => {
  try {
    // console.log("req.query: ", req.query);
    const advisorId = req.query.advisorId ? parseInt(req.query.advisorId as string) : null;
    const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : null;

    if (!advisorId || isNaN(advisorId)) return res.status(400).json({ error: 'Invalid advisor ID' });
    if (!studentId || isNaN(studentId)) return res.status(400).json({ error: 'Invalid student ID' });

    const advisorExists = await checkAdvisor(advisorId);
    if (!advisorExists) return res.status(404).json({ error: 'Advisor not found' });
    const studentExists = await checkStudent(studentId);
    if (!studentExists) return res.status(404).json({ error: 'Student not found' });

    const comment = await getConversation(studentId, advisorId)

    res.status(200).json({
      comment
    });
  } catch (error) {
    res.status(500).send('Error creating comment.');
  }
});

router.post('/comment', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    // console.log("req.body: ", req.body);
    const advisorId = req.body.advisorId ? parseInt(req.body.advisorId) : null;
    const studentId = req.body.studentId ? parseInt(req.body.studentId) : null;

    if (!content) return res.status(400).send({ error: 'Missing comment contents.' });
    if (!advisorId || isNaN(advisorId)) return res.status(400).json({ error: 'Invalid advisor ID' });
    if (!studentId || isNaN(studentId)) return res.status(400).json({ error: 'Invalid student ID' });

    const advisorExists = await checkAdvisor(advisorId);
    if (!advisorExists) return res.status(404).json({ error: 'Advisor not found' });
    const studentExists = await checkStudent(studentId);
    if (!studentExists) return res.status(404).json({ error: 'Student not found' });

    const newComment: Comment = { content, studentId, advisorId };
    const comment = await createComment(newComment)

    res.status(201).json({
      message: 'Comment created successfully!',
      comment
    });
  } catch (error) {
    res.status(500).send('Error creating comment.');
  }
});

router.post('/reply', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const commentId = req.body.commentId ? parseInt(req.body.commentId) : null;

    if (!content) return res.status(400).send({ error: 'Missing comment contents.' });
    if (!commentId || isNaN(commentId)) return res.status(400).json({ error: 'Invalid comment ID' });

    const commentExists = await checkComment(commentId);
    if (!commentExists) return res.status(404).json({ error: 'Comment not found' });

    const newReply: Reply = { content, commentId };
    const reply = await createReply(newReply)

    res.status(201).json({
      message: 'Reply created successfully!',
      reply
    });
  } catch (error) {
    res.status(500).send('Error creating reply.');
  }
});

router.post('/announcement', authenticateJWT, authorizeRole(['advisor']), upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    console.log(req.body);
    const { topic, content } = req.body;
    const userId = req.user?.userId ? parseInt(req.user.userId) : null;

    if (!file || !topic || !content) return res.status(400).send({ error: 'Missing announcement contents.' });
    if (!userId || isNaN(userId)) return res.status(400).json({ error: 'Invalid advisor ID' });

    const advisorExists = await checkAdvisor(userId);
    if (!advisorExists) return res.status(404).json({ error: 'Advisor not found' });

    if (!bucket) return res.status(500).send('Bucket name or file path not configured.');

    const filePath = "announcement";
    const ouputUrl = await uploadFile(bucket, filePath, file);
    const newAnnouncement: Announcement = { fileUrl: ouputUrl, advisorId: advisorExists.id, topic, content };
    const announcement = await createAnnouncement(newAnnouncement)

    res.status(201).json({
      message: 'Announcement created successfully!',
      announcement
    });
  } catch (error) {
    res.status(500).send('Error creating announcement.');
  }
});

export default router;



