import mongoose from "mongoose";
import Category from "../../../models/category.model.js";
import Product from "../../../models/product.model.js"; // Adjust the path according to your project structure
import { generateSlug } from "../../../helper/slug.helper.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../helper/response.helper.js";
import { deleteImage } from "../../../helper/multer.helper.js";
import asyncHandler from "express-async-handler";

// Controller to add a new product
const addProduct = async (req, res) => {
  try {
    const {
      title,
      order,
      status,
      category,
      description,
      specification,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
    } = req.body;

    const { thumbnail1 } = req.files;

    const requiredFields = {
      title,
      order,
      status,
      category,
      description,
      specification,
      // uses,
      thumbnail1,
      // thumbnail2,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
    };

    const missingFields = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key]
    );
    if (missingFields.length > 0) {
      return sendErrorResponse(
        res,
        400,
        `Invalid or incomplete data: Missing fields ${missingFields.join(", ")}`
      );
    }
    // if (
    //   uses &&
    //   (!Array.isArray(uses) ||
    //     !uses.every((item) => typeof item === "string"))
    // ) {
    //   return sendErrorResponse(res, 400, `Invalid uses`);
    // }

    const isCategoryExists = await Category.findById(category);
    if (!isCategoryExists) {
      return sendErrorResponse(res, 400, `Category not found`);
    }
    const maxOrderBanner = await Product.findOne(
      { category: new mongoose.Types.ObjectId(category) },
      { order: 1 }
    )
      .sort({ order: -1 })
      .limit(1);
    const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;
    let newOrder = Number(order);
    if (newOrder >= maxOrder) {
      newOrder = maxOrder + 1; // set the new post's order to maxOrder + 1
    } else {
      await Product.updateMany(
        {
          order: { $gte: newOrder },
          category: mongoose.Types.ObjectId(categoryId), // Use the converted ObjectId
        },
        { $inc: { order: 1 } } // Increment the order by 1
      );
    }
    const slug = generateSlug(title);
    // Creating a new product instance
    const newProduct = new Product({
      title,
      slug,
      order,
      status,
      category,
      description,
      specification,
      thumbnail1: thumbnail1[0]?.filename,
      // thumbnail2: thumbnail2[0]?.filename,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
    });

    // Save the product in the database
    const savedProduct = await newProduct.save();

    // Return the saved product as a response
    return sendSuccessResponse(
      res,
      200,
      savedProduct,
      "Product saved successfully"
    );
  } catch (error) {
    return sendErrorResponse(res, 400, `Some rror occurred: ${error.message}`);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendErrorResponse(res, 404, `Product Id is required`);
    }
    const {
      title,
      order,
      // status,
      // category,
      description,
      specification,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
    } = req.body;

    const { thumbnail1, thumbnail2 } = req.files || {};

    // Validate product existence
    const product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(res, 404, `Product not found`);
    }

    // Validate required fields
    const requiredFields = {
      title,
      order,
      // status,
      // category,
      description,
      specification,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
    };

    const missingFields = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key]
    );
    if (missingFields.length > 0) {
      return sendErrorResponse(
        res,
        400,
        `Invalid or incomplete data: Missing fields ${missingFields.join(", ")}`
      );
    }

    // Validate uses
    // if (
    //   uses &&
    //   (!Array.isArray(uses) || !uses.every((item) => typeof item === "string"))
    // ) {
    //   return sendErrorResponse(res, 400, `Invalid uses`);
    // }

    // Validate category existence
    // const isCategoryExists = await Category.findById(category);
    // if (!isCategoryExists) {
    //   return sendErrorResponse(res, 400, `Category not found`);
    // }

    // Handle product order logic
    const maxOrderBanner = await Product.findOne(
      // { category: mongoose.Types.ObjectId(category) },
      { order: 1 }
    )
      .sort({ order: -1 })
      .limit(1);
    const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;
    let newOrder = Number(order);

    if (newOrder >= maxOrder) {
      newOrder = maxOrder + 1;
    } else {
      // Update orders of other products if newOrder is less than the max
      await Product.updateMany(
        {
          order: { $gte: newOrder },
          // category: mongoose.Types.ObjectId(category),
        },
        { $inc: { order: 1 } }
      );
    }

    // Generate slug for the product
    const slug = generateSlug(title);

    // Update product data
    const updatedData = {
      title,
      slug,
      order: newOrder,
      // status,
      // category,
      description,
      specification,
      uses,
      actualPrice,
      discountedPrice,
      taxPercent,
      totalTax,
      basePrice,
      minQuantity,
      maxQuantity,
      currentAvailableQuantity,
      tags,
      metaDescription,
      metaTitle,
      ...(thumbnail1 && { thumbnail1: thumbnail1[0]?.filename }),
      // ...(thumbnail2 && { thumbnail2: thumbnail2[0]?.filename }),
    };

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true } // To return the updated document
    );

    if (product.thumbnail1 && thumbnail1) {
      deleteImage(product.thumbnail1);
    }
    if (product.thumbnail2 && thumbnail2) {
      deleteImage(product.thumbnail2);
    }

    // Return the updated product as a response
    return sendSuccessResponse(
      res,
      200,
      updatedProduct,
      "Product updated successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      `Error updating product: ${error.message}`
    );
  }
};

const getProductById = asyncHandler(async (req, res) => {
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

const toggleProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 404, `Product Id is required`);
  }
  const product = await Product.findById(id);
  if (!product) {
    return sendErrorResponse(res, 404, `Product not found`);
  }
  if (product.status === "ACTIVE") {
    product.status = "INACTIVE"; // toggle the status
  } else {
    product.status = "ACTIVE";
  }

  await product.save();
  return sendSuccessResponse(
    res,
    200,
    product,
    "Product status updated successfully"
  );
});

const getProductsList = async (req, res) => {
  const { fromDate, toDate, keyword, categoryName, page, limit } = req.query;
  const pipeline = [];

  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });
  // Date filter
  if (fromDate && toDate) {
    pipeline.push({
      $match: {
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      },
    });
  }

  // Keyword filter
  if (keyword) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { specification: { $regex: keyword, $options: "i" } },
        ],
      },
    });
  }

  // Category filter (requires lookup)
  pipeline.push({
    $lookup: {
      from: "categories", // Adjust collection name if needed
      localField: "category",
      foreignField: "_id",
      as: "categoryInfo",
    },
  });

  pipeline.push({
    $unwind: {
      path: "$categoryInfo",
      preserveNullAndEmptyArrays: true, // Preserve products without a category
    },
  });

  if (categoryName) {
    pipeline.push({
      $match: {
        "categoryInfo.name": categoryName,
      },
    });
  }

  // Projection
  pipeline.push({
    $project: {
      _id: 1,
      title: 1,
      slug: 1,
      order: 1,
      status: 1,
      description: 1,
      specification: 1,
      uses: 1,
      thumbnail1: 1,
      thumbnail2: 1,
      createdAt: 1,
      updatedAt: 1,
      categoryName: "$categoryInfo.name", // Include category name
    },
  });

  try {
    // Using mongoose-aggregate-paginate-v2 for pagination
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };

    const aggregatedData = await Product.aggregatePaginate(
      Product.aggregate(pipeline),
      options
    );

    const data = {
      count: aggregatedData.totalDocs,
      totalPages: aggregatedData.totalPages,
      currentPage: aggregatedData.page,
      products: aggregatedData.docs,
    };

    // Structure the response data
    return sendSuccessResponse(
      res,
      200,
      data,
      "Product list fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductOrder = async (req, res) => {
  const ProductList = await Product.find({});
  const length = ProductList?.length ?? 0;
  return sendSuccessResponse(
    res,
    200,
    { order: length + 1 },
    "Product order get successfully"
  );
};

export {
  addProduct,
  updateProduct,
  getProductById,
  toggleProductStatus,
  getProductsList,
  getProductOrder,
};
