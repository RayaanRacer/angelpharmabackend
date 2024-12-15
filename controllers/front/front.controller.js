import expressAsyncHandler from "express-async-handler";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../helper/response.helper.js";
import Product from "../../models/product.model.js";

const getProductById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 404, `Product Id is required`);
  }
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name bgColor",
  });
  if (!product) {
    return sendErrorResponse(res, 404, `Product not found`);
  }
  return sendSuccessResponse(res, 200, product, "Product get successfully");
});

const getProductList = expressAsyncHandler(async (req, res) => {
  const productList = await Product.find();
  return sendSuccessResponse(
    res,
    200,
    productList,
    "Product list get successfully"
  );
});

export { getProductById, getProductList };
