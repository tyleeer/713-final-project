// express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?:
        | {
            userId: string;
            student: { id: number }; // student.id เป็นตัวเลข
            advisor?: never;
          }
        | {
            userId: string;
            advisor: { id: number }; // advisor.id เป็นตัวเลข
            student?: never;
          };
    }
  }
}