import express from 'express';
import {
    assignAdvisorToStudent,
    getAdvisorsWithStudentCount,
    getAdvisorAppointmentsSummary,
    updateStudentAdvisor
} from '../controllers/assignAdvisorController';
import { authenticateJWT as authenticate, authorizeRole as authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin(["admin"]));

router.post('/assign', assignAdvisorToStudent);
router.get('/advisors', getAdvisorsWithStudentCount);
router.get('/appointments', getAdvisorAppointmentsSummary);
router.put('/change', updateStudentAdvisor);

export default router;