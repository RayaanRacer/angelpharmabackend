import express from "express";
import { isAdmin } from "../../../middleware/auth.middleware.js";
import { uploadImages } from "../../../helper/multer.helper.js";
import {
  configUpdate,
  GetConfigById,
} from "../../../controllers/admin/config/config.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/config:
 *   post:
 *     summary: Update Config
 *     description: This endpoint allows to Update Config
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sitename:
 *                 type: string
 *                 example: "www.airswag.in"
 *               logo:
 *                 type: string
 *                 format: binary
 *               contactNo:
 *                 type: string
 *               email:
 *                 type: string
 *               url:
 *                 type: string
 *               color:
 *                 type: string
 *               fb:
 *                 type: string
 *               insta:
 *                 type: string
 *               x:
 *                 type: string
 *               yt:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               totalUser:
 *                 type: string
 *               totalOrders:
 *                 type: string
 *               totalPayments:
 *                 type: string
 *               totalVisits:
 *                 type: string
 *               changeCounts:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid credentials
 */
router.post("/config", isAdmin, uploadImages, configUpdate);

/**
 * @swagger
 * /api/v1/admin/config:
 *   get:
 *     summary: Get Config
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Config
 *     security:
 *       - BearerAuth: []  # JWT authentication applied to this route
 *     responses:
 *       200:
 *         description: Successfully accessed the protected route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully accessed the protected route"
 *       403:
 *         description: Forbidden, admin only
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden, admin only"
 */
router.get("/config", isAdmin, GetConfigById);

export default router;
