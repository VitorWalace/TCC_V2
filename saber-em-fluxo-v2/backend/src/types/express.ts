// FILE: /backend/src/types/express.ts
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  iat?: number;
  exp?: number;
}

// Extend the Express Request type to include our user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
