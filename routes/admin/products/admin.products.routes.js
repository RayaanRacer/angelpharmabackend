/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for product management
 */

/**
 * @swagger
 * /api/v1/admin/product:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product
 *                 example: Smartphone
 *               order:
 *                 type: integer
 *                 description: Order of the product in the category
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: Status of the product
 *                 example: active
 *               category:
 *                 type: string
 *                 description: Category ID
 *                 example: "64d8b2f9c4e3f3d2a0f8c123"
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "High-quality smartphone"
 *               specification:
 *                 type: string
 *                 description: Product specifications
 *                 example: "6GB RAM, 128GB Storage"
 *               uses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of accessories
 *                 example: ["Charger", "Earphones"]
 *               thumbnail1:
 *                 type: string
 *                 format: binary
 *                 description: Primary thumbnail image
 *               actualPrice:
 *                 type: number
 *                 description: actual price of the product
 *               discountedPrice:
 *                 type: number
 *                 description: discountedPrice price of the product
 *               taxPercent:
 *                 type: number
 *                 description: taxPercent price of the product
 *               totalTax:
 *                 type: number
 *                 description: totalTax price of the product
 *               basePrice:
 *                 type: number
 *                 description: basePrice price of the product
 *               minQuantity:
 *                 type: number
 *                 description: minQuantity price of the product
 *               maxQuantity:
 *                 type: number
 *                 description: maxQuantity price of the product
 *               currentAvailableQuantity:
 *                 type: number
 *                 description: currentAvailableQuantity price of the product
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of uses
 *                 example: ["Ear", "Mouth"]
 *               metaDescription:
 *                 type: string
 *                 description: metaDescription price of the product
 *               metaTitle:
 *                 type: string
 *                 description: metaTitle price of the product
 *     responses:
 *       200:
 *         description: Product added successfully
 *       400:
 *         description: Invalid or missing data
 */

// Add other endpoints similarly...

// Import statements remain the same
import express from "express";
import { isAdmin } from "../../../middleware/auth.middleware.js";
import { uploadImages } from "../../../helper/multer.helper.js";
import {
  addProduct,
  getProductById,
  getProductOrder,
  getProductsList,
  toggleProductStatus,
  updateProduct,
} from "../../../controllers/admin/products/products.controller.js";

const router = express.Router();

router.post("/product", isAdmin, uploadImages, addProduct);
router.get("/products", isAdmin, getProductsList);
router.post("/product/:id", isAdmin, uploadImages, updateProduct);
router.delete("/product/:id", isAdmin, toggleProductStatus);
router.get("/product/:id", isAdmin, getProductById);
router.get("/product-order", isAdmin, getProductOrder);

export default router;
