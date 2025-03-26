import { Request,Response } from "express";
import * as commentService from '../services/commentService';

// ส่งข้อความนักศึกษาไปที่อาจารย์
export const createCommend = async (req:Request, res:Response) =>{
    try{
        const {advisorId , content} = req.body;
        if (!req.user || !req.user.student) {
            return res.status(400).json({ error: 'User information is missing' });
        }
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
      if (!req.user || !req.user.student) {
        return res.status(400).json({ error: 'User information is missing' });
      }
      
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
      if (!req.user || !req.user.advisor) {
        return res.status(400).json({ error: 'User information is missing' });
      }
      
      const reply = await commentService.replytoComment(commentId, content, false);
      res.status(201).json(reply);
    } catch (error) {
      res.status(500).json({ error: 'Failed to post reply' });
    }
  };

// ดึงการตอบกลับของนักศึกษาทั้งหมด
export const getStudentConversations = async (req: Request, res: Response) => {
    try {
      const studentId = req.user?.student?.id;
      if (!studentId) {
        return res.status(400).json({ error: 'User information is missing' });
      }
      const comments = await commentService.getStudentComments(studentId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  };

// ดึงตอบกลับของอาจารย์ทั้งหมด
export const getAdvisorConversations = async (req: Request, res: Response) => {
    try {
      const advisorId = req.user?.advisor?.id;
      if (!advisorId) {
        return res.status(400).json({ error: 'User information is missing' });
      }
      const comments = await commentService.getAdvisorComment(advisorId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  };  
  
 // ดึงข้อความของนักศึกษากับอาจารย์
export const getConversation = async (req: Request, res: Response) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const advisorId = req.user?.advisor?.id;
      if (!advisorId) {
        return res.status(400).json({ error: 'User information is missing' });
      }
      
      const conversation = await commentService.getConversation(studentId, advisorId);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get conversation' });
    }
  }; 
