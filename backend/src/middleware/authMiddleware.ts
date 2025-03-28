import jwt from 'jsonwebtoken';
import { NextFunction, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string,
        student: { id: number }; // student.id เป็นตัวเลข
        advisor?: never;
      }
      | {
        userId: string;
        role: string,
        advisor: { id: number }; // advisor.id เป็นตัวเลข
        student?: never;
      };
    }
  }
}

// JWT Authentication Middleware
export const authenticateJWT = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token.' });
    }

    // ตรวจสอบว่า token มี role หรือไม่
    if (!user.role) {
      return res.status(403).json({ message: 'Role not found in token' });
    }

    req.user = user; // เก็บ user + role ไว้ใน req
    next();
  });
};

// Role Authorization Middleware
export const authorizeRole = (role: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    if (!role.find(r => r.toLowerCase().includes(req.user.role?.toLowerCase()))) {
      return res.status(403).json({ message: 'forbidden' });
    }
    next();
  };
};