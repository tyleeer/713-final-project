import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// JWT Authentication Middleware
export const authenticateJWT = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Access denied. No token provided.');
  }

  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }

    // ตรวจสอบว่า token มี role หรือไม่
    if (!user.role) {
      return res.status(403).send('Invalid token: No role assigned.');
    }

    req.user = user; // เก็บ user + role ไว้ใน req
    next();
  });
};
