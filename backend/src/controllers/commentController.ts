import { Request, Response } from "express";
import * as commentService from '../services/commentService';
import { getStudentByUserId } from "../services/studentService";
import { checkAdvisor } from "../services/advisorService";

// ส่งข้อความนักศึกษาไปที่อาจารย์

export const createCommend = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId ? parseInt(req.user?.userId) : 0;
    const student = await getStudentByUserId(userId);
    if (!student) throw new Error('User not authenticated');

    const { content } = req.body;

    const advisorId = student.profile?.Student?.advisorId ?? 0;
    const comment = await commentService.createCommend(student.id, advisorId, content);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const createCommendByAdvisor = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId ? parseInt(req.user?.userId) : 0;
    const advisor = await checkAdvisor(userId);
    if (!advisor) throw new Error('User not authenticated');

    const { content, studentId } = req.body;

    const comment = await commentService.createCommendByAdvisor(+studentId, advisor.id, content);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

//นักศึกษาตอบกลับ
export const studentReply = async (req: Request, res: Response) => {
  try {
    const { commentId, content } = req.body;
    const reply = await commentService.replytoComment(+commentId, content, true);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post reply' });
  }
};

// อาจารย์ตอบกลับ
export const advisorReply = async (req: Request, res: Response) => {

  try {
    const { commentId, content } = req.body;
    const reply = await commentService.replytoComment(commentId, content, false);
    res.status(201).json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to post reply' });
  }
};

// ดึงการตอบกลับของนักศึกษาทั้งหมด
export const getStudentConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId ? parseInt(req.user?.userId) : 0;
    const student = await getStudentByUserId(userId);
    if (!student) throw new Error('User not authenticated');

    const studentId = student.profile?.Student?.id ? student.profile?.Student?.id : 0;
    const comments = await commentService.getStudentComments(studentId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

// ดึงตอบกลับของอาจารย์ทั้งหมด
export const getAdvisorConversations = async (req: Request, res: Response) => {

  try {
    const userId = req.user?.userId ? parseInt(req.user?.userId) : 0;
    const advisor = await checkAdvisor(userId);
    if (!advisor) throw new Error('User not authenticated');

    const studentId = parseInt(req.query?.studentId as string) || 0;
    const comments = await commentService.getAdvisorComment(advisor.id, studentId);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

// ดึงข้อความของนักศึกษากับอาจารย์
export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId ? parseInt(req.user?.userId) : 0;
    const student = await getStudentByUserId(userId);
    if (!student) throw new Error('User not authenticated');

    const advisorId = student.profile?.Student?.advisorId ?? 0;
    const conversation = await commentService.getConversation(student.id, +advisorId);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};


export const getComment = async (req: Request, res: Response) => {

  try {
    const comments = await commentService.getComment();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};
