import { createToken } from "../../helper/jwt.helper.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../helper/response.helper.js";
import {
  validateEmail,
  validatePhoneNumber,
} from "../../helper/validator.helper.js";
import Admin from "../../models/admin.model.js";
import asyncHandler from "express-async-handler";
import Category from "../../models/category.model.js";
import { generateSlug } from "../../helper/slug.helper.js";
import bcrypt from "bcrypt";
import Product from "../../models/product.model.js";

const adminRegister = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return sendErrorResponse(res, 400, "Incomplete Data");
  }
  if (!validateEmail(email)) {
    return sendErrorResponse(res, 400, "Invalid Data");
  }
  const existsEmail = await Admin.findOne({ email });

  if (existsEmail) {
    return sendErrorResponse(res, 400, "No need for new admins");
  }
  const newAdmin = new Admin({
    name,
    email,
    password,
    permissions: {
      canCreateUser: true,
      canDeleteUser: true,
      canUpdateSettings: true,
    },
    role: "superadmin",
  });
  await newAdmin.save();
  return sendSuccessResponse(res, 200, {}, "Admin created sucessfully");
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendErrorResponse(res, 400, "Incomplete data");
  }
  const userExists = await Admin.findOne({ email });
  if (!userExists) {
    return sendErrorResponse(res, 400, "No such acount exists");
  }
  const isMatch = await userExists.comparePassword(password);
  if (!isMatch) {
    return sendErrorResponse(res, 400, "Incorrect credentials");
  }
  const payload = {
    email,
    name: userExists.name,
    permissions: userExists.permissions,
    role: userExists.role,
  };
  const userInfo = {
    email,
    name: userExists.name,
    permissions: userExists.permissions,
    role: userExists.role,
  };
  const token = createToken(payload);
  return sendSuccessResponse(
    res,
    200,
    { token: token, userData: userInfo },
    "Login successful"
  );
});

const middlewareCheck = asyncHandler(async (req, res) => {
  return sendSuccessResponse(res, 200, { data: "ok", data1: req.body }, "ok");
});

/*******************************  Category CRUD ****************************************/

const addCategory = asyncHandler(async (req, res) => {
  const {
    name,
    description, // Assuming the typo in 'descrption' should be 'description'
    bgColor,
    status,
  } = req.body;

  const userId = req.user._id;

  const { webImage, appImage, icon } = req.files;

  // Validate required fields using array of missing fields for clarity
  const requiredFields = {
    name,
    description,
    icon,
    webImage,
    appImage,
    bgColor,
    status,
    userId,
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

  // Check if category name already exists
  const isNameExists = await Category.findOne({ name, status: true });
  if (isNameExists) {
    return sendErrorResponse(res, 400, "Category name already exists");
  }

  // Generate unique slug by checking for duplicates
  let slug = generateSlug(name);

  while (await Category.exists({ slug })) {
    slug = generateSlug(name);
  }

  // Create new category
  const newCategory = new Category({
    name,
    description,
    slug: slug,
    icon: icon[0]?.filename,
    webImage: webImage[0]?.filename,
    appImage: appImage[0]?.filename,
    bgColor,
    status,
    createdBy: userId,
  });

  await newCategory.save();
  return sendSuccessResponse(res, 200, {}, "Category added successfully");
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "Category ID is required");
  }

  const category = await Category.findById(id).populate([
    {
      path: "createdBy",
      select: "role name",
    },
    {
      path: "updatedBy",
      select: "role name",
    },
  ]);
  if (!category) {
    return sendErrorResponse(res, 400, "Category not found");
  }
  return sendSuccessResponse(res, 200, category, "Category get successfully");
});

const toggleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "Category id is required");
  }
  const foundCategory = await Category.findById(id);

  if (!foundCategory) {
    return sendErrorResponse(res, 400, "Category not found");
  }
  if (foundCategory.status === true) {
    await Category.findByIdAndUpdate(id, { status: false }, { new: true });
    return sendSuccessResponse(
      res,
      200,
      {},
      "Category status is Inactive successfully"
    );
  }
  await Category.findByIdAndUpdate(id, { status: true }, { new: true });
  return sendSuccessResponse(
    res,
    200,
    {},
    "Category status is Active successfully"
  );
});

const categoryList = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: "ACTIVE" });
  return sendSuccessResponse(
    res,
    200,
    categories,
    "Categories get successfully"
  );
});

/*******************************  Product CRUD *********************************/
const addProduct = asyncHandler(async (req, res) => {
  const { title, order, status, category, description, specification } =
    req.body;

  const userId = req.user._id;

  const { thumbnail } = req.files;

  // Validate required fields using array of missing fields for clarity
  const requiredFields = {
    title,
    order,
    status,
    category,
    description,
    specification,
    thumbnail,
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

  // Check if Product name already exists
  const isNameExists = await Product.findOne({ title });
  if (isNameExists) {
    return sendErrorResponse(res, 400, "Product name already exists");
  }

  // Generate unique slug by checking for duplicates
  let slug = generateSlug(title);

  while (await Product.exists({ slug })) {
    slug = generateSlug(title);
  }

  // Create new Product
  const newProduct = new Product({
    title,
    category,
    description,
    slug: slug,
    thumbnail1: thumbnail[0]?.filename,
    specification,
    status,
    createdBy: userId,
    order,
  });

  await newProduct.save();
  return sendSuccessResponse(res, 200, {}, "Product added successfully");
});

export {
  adminRegister,
  adminLogin,
  middlewareCheck,
  addCategory,
  getCategoryById,
  toggleCategory,
  addProduct,
  categoryList,
};
