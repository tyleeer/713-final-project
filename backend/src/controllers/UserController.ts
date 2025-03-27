// src/controllers/userController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';

// Get User Profile
export const getProfile = async (req: Request, res: Response) => {

  if (!req.body.user) {
    return res.status(400).json({ message: 'User information is missing' });
  }

  const userId = req.body.user.userId;
  if (userId === undefined || userId === null || userId === '') {
    return res.status(400).json({ message: 'User information is missing' });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: +userId },
    include: { Student: true, Advisor: true },
  });

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json(profile);
};
