import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!; // นำค่าจาก .env มาใช้

// JWT Authentication Middleware
export const authenticateJWT = (req: any, res: any, next: any) => {
  // ดึง token จาก header
  const token = req.headers['authorization']?.split(' ')[1]; // ตัวอย่างการแยก token จาก "Bearer <token>"

  if (!token) {
    return res.status(403).send('Access denied. No token provided.');
  }

  // ตรวจสอบความถูกต้องของ token โดยใช้ jwt.verify
  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }

    // หาก token ถูกต้อง ให้เก็บข้อมูลของผู้ใช้ใน req.user
    req.user = user;
    next(); // ให้ request ไปยัง middleware ถัดไป
  });
};
