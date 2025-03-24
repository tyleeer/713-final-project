// src/controllers/userController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Get User Profile
export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { student: true, advisor: true },
  });

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json(profile);
};
