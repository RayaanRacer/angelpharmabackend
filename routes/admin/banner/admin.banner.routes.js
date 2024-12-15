import express from "express";
import { isAdmin } from "../../../middleware/auth.middleware.js";
import { uploadImages } from "../../../helper/multer.helper.js";
import {
  addBanner,
  getBannerById,
  getBannerList,
  toggleBanner,
  updateBanner,
} from "../../../controllers/admin/banner/banner.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/banner:
 *   post:
 *     summary: Create Banner
 *     description: This endpoint allows to Create Banner
 *     tags:
 *       - Banner
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bannerName:
 *                 type: string
 *                 example: "www.airswag.in"
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *               bannerBtnText:
 *                 type: string
 *               bannerBtnLink:
 *                 type: string
 *               order:
 *                 type: number
 *               status:
 *                 type: boolean
 *               bannerDescription:
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
router.post("/banner", isAdmin, uploadImages, addBanner);

/**
 * @swagger
 * /api/v1/admin/banner/{id}:
 *   put:
 *     summary: update banner
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Banner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to update
 *         example: "61f8f83b9b4bce24d874e6e1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bannerName:
 *                 type: string
 *                 example: "www.airswag.in"
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *               bannerBtnText:
 *                 type: string
 *               bannerBtnLink:
 *                 type: string
 *               order:
 *                 type: number
 *               status:
 *                 type: boolean
 *               bannerDescription:
 *                 type: string
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
router.put("/banner/:id", uploadImages, isAdmin, updateBanner);

/**
 * @swagger
 * /api/v1/admin/banner/{id}:
 *   delete:
 *     summary: toggle banner
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Banner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to update
 *         example: "670158e2186fff36e8151091"
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
router.delete("/banner/:id", isAdmin, toggleBanner);

/**
 * @swagger
 * /api/v1/admin/banner/{id}:
 *   get:
 *     summary: ger banner by id
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Banner
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to update
 *         example: "61f8f83b9b4bce24d874e6e1"
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
router.get("/banner/:id", isAdmin, getBannerById);

/**
 * @swagger
 * /api/v1/admin/banner:
 *   get:
 *     summary: get all banner
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Banner
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
router.get("/banner", isAdmin, getBannerList);

export default router;
