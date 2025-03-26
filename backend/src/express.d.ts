import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
                student: {
                    id: string;
                }
                advisor: {
                    id: string;
                }
            }
        }
    }
}