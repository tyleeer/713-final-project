import express, { Request, Response } from "express";
import * as service from "../services/studentService";
const router = express.Router();


router.get("/", async (req, res) => {
    const result = await service.getAdvisor();
    res.json(result);
});


export default router;
