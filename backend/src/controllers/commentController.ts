import { Request,Response } from "express";
import * as commentService from '../services/commentService';

// ส่งcomment นักศึกษาไปที่อาจารย์
export const createCommend = async (req:Request, res:Response) =>{
    try{
        const {advisorId , content} = req.body;
        const studentId = req.user.student.id; 
    
    const comment = await commentService.createCommend(studentId, advisorId, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

//นักศึกษาตอบกลับ
export const studentReply = async (req: Request, res: Response) => {
    try {
      const { commentId, content } = req.body;
      const studentId = req.user.student.id;
      
      const reply = await commentService.replytoComment(commentId, content, true);
      res.status(201).json(reply);
    } catch (error) {
      res.status(500).json({ error: 'Failed to post reply' });
    }
  };

// อาจารย์ตอบกลับ
export const advisorReply = async (req: Request, res: Response) => {
    try {
      const { commentId, content } = req.body;
      const advisorId = req.user.advisor.id;
      
      const reply = await commentService.replytoComment(commentId, content, false);
      res.status(201).json(reply);
    } catch (error) {
      res.status(500).json({ error: 'Failed to post reply' });
    }
  };

// ดึงการตอบกลับของนักศึกษาทั้งหมด
export const getStudentConversations = async (req: Request, res: Response) => {
    try {
      const studentId = req.user.student.id;
      const comments = await commentService.getStudentComments(studentId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  };

// ดึงตอบกลับของอาจารย์ทั้งหมด
export const getAdvisorConversations = async (req: Request, res: Response) => {
    try {
      const advisorId = req.user.advisor.id;
      const comments = await commentService.getAdvisorComment(advisorId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  };  
  
 // ดึงการพูดคุยของนักศึกษากับอาจารย์
export const getConversation = async (req: Request, res: Response) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const advisorId = req.user.advisor.id;
      
      const conversation = await commentService.getConversation(studentId, advisorId);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversation' });
    }
  }; 
