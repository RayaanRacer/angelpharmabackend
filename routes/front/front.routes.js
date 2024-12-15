import express from "express";
import {
  getProductById,
  getProductList,
} from "../../controllers/front/front.controller.js";

const router = express.Router();

router.get("/product/:id", getProductById);
router.get("/product", getProductList);

export default router;
