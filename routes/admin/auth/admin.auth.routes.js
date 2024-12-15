import express from "express";
import {
  addCategory,
  adminLogin,
  adminRegister,
  getCategoryById,
  categoryList,
  middlewareCheck,
  toggleCategory,
} from "../../../controllers/admin/admin.controller.js";
import { isAdmin } from "../../../middleware/auth.middleware.js";
import { uploadImages } from "../../../helper/multer.helper.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Admin authorization
 *
 * /api/v1/admin/register:
 *   post:
 *     summary: Register an admin
 *     description: This endpoint allows to register an admin
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "admin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "yourpassword"
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
router.post("/register", adminRegister);

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login an admin
 *     description: This endpoint allows an admin to log in with their email and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "yourpassword"
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
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 userData:
 *                   type: object
 *                   description: Information about the logged-in admin
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     name:
 *                       type: string
 *                       example: "Admin Name"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["read", "write", "execute"]
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Invalid credentials or incomplete data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No such account exists"  # Fix: Removed "or" and clarified example format
 */
router.post("/login", adminLogin);

/**
 * @swagger
 * /api/v1/admin/protected-route:
 *   get:
 *     summary: Access a protected admin route
 *     description: This endpoint requires a valid JWT token for access.
 *     tags:
 *       - Auth
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
router.get("/protected-route", isAdmin, middlewareCheck);

/**
 * @swagger
 * /api/v1/admin/category:
 *   post:
 *     summary: Add a new category
 *     description: This endpoint allows the admin to add a new category with details like name, description, images, etc.
 *     tags:
 *       - admin/category
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *               - webImage
 *               - appImage
 *               - bgColor
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: A brief description of the category
 *                 example: "This category contains electronic products."
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: URL for the category icon
 *               webImage:
 *                 type: string
 *                 format: binary
 *                 description: URL for the category web image
 *               appImage:
 *                 type: string
 *                 format: binary
 *                 description: URL for the category app image
 *               bgColor:
 *                 type: string
 *                 description: Background color for the category
 *                 example: "#FFFFFF"
 *               status:
 *                 type: boolean
 *                 description: Whether the category is active
 *                 example: true
 *     responses:
 *       200:
 *         description: Category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category added successfully"
 *                 data:
 *                   type: object
 *                   description: Contains the added category details
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Electronics"
 *                     description:
 *                       type: string
 *                       example: "This category contains electronic products."
 *                     slug:
 *                       type: string
 *                       example: "electronics"
 *                     status:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid or incomplete data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or incomplete data: Missing fields name, description"
 *       409:
 *         description: Conflict - Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category name already exists"
 */
router.post("/category", isAdmin, uploadImages, addCategory);

/**
 * @swagger
 * /api/v1/admin/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     description: Retrieve a category by its unique ID.
 *     tags:
 *       - admin/category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category get successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Electronics"
 *                     description:
 *                       type: string
 *                       example: "Category for electronic items"
 *                     icon:
 *                       type: string
 *                       example: "/images/electronics-icon.png"
 *                     webImage:
 *                       type: string
 *                       example: "/images/electronics-web.png"
 *                     appImage:
 *                       type: string
 *                       example: "/images/electronics-app.png"
 *                     bgColor:
 *                       type: string
 *                       example: "#FFFFFF"
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     createdBy:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c84"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-02T10:20:30.000Z"
 *       400:
 *         description: Invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category ID is required"
 */
router.get("/category/:id", isAdmin, getCategoryById);

/**
 * @swagger
 * /api/v1/admin/category/{id}:
 *   put:
 *     summary: Get a category by ID
 *     description: Toggle a category by its unique ID.
 *     tags:
 *       - admin/category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category toggled successfully"
 *       400:
 *         description: Invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category ID is required"
 */
router.put("/category/:id", isAdmin, toggleCategory);

/**
 * @swagger
 * /api/v1/admin/category:
 *   get:
 *     summary: Get category list
 *     description: get  category list.
 *     tags:
 *       - admin/category
 */
router.get("/category", isAdmin, categoryList);

export default router;
