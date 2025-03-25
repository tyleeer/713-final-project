import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                // Add other properties if needed
            };
        }
    }
}