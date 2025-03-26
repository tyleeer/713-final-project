import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            user?: {
                [x: string]: any;
                [x: string]: any;
                userId: string;
                // Add other properties if needed
            };
        }
    }
}