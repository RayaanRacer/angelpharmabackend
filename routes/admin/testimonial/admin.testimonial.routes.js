import express from "express";
import { isAdmin } from "../../../middleware/auth.middleware.js";
import { uploadImages } from "../../../helper/multer.helper.js";
import {
  addTestimonial,
  getTestimonialById,
  getTestimonialList,
  toggleTestimonial,
  updateTestimonial,
} from "../../../controllers/admin/testimonial/testimonial.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/testimonial:
 *   post:
 *     summary: Create testimonial
 *     description: This endpoint allows to Create testimonial
 *     tags:
 *       - Testimonial
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "www.airswag.in"
 *               image:
 *                 type: string
 *                 format: binary
 *               color:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: string
 *               order:
 *                 type: number
 *               status:
 *                 type: boolean
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
router.post("/testimonial", isAdmin, uploadImages, addTestimonial);

/**
 * @swagger
 * /api/v1/admin/testimonial/{id}:
 *   put:
 *     summary: update testimonial
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Testimonial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the testimonial to update
 *         example: "61f8f83b9b4bce24d874e6e1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "www.airswag.in"
 *               color:
 *                 type: string
 *                 format: binary
 *               image:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: string
 *               order:
 *                 type: number
 *               status:
 *                 type: boolean
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
router.put("/testimonial/:id", uploadImages, isAdmin, updateTestimonial);

/**
 * @swagger
 * /api/v1/admin/testimonial/{id}:
 *   delete:
 *     summary: toggle testimonial
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Testimonial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the testimonial to update
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
router.delete("/testimonial/:id", isAdmin, toggleTestimonial);

/**
 * @swagger
 * /api/v1/admin/testimonial/{id}:
 *   get:
 *     summary: ger banner by id
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Testimonial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the testimonial to update
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
router.get("/testimonial/:id", isAdmin, getTestimonialById);

/**
 * @swagger
 * /api/v1/admin/testimonial:
 *   get:
 *     summary: get all testimonial
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Testimonial
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
router.get("/testimonial", isAdmin, getTestimonialList);

export default router;
