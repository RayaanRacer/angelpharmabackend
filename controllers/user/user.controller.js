import expressAsyncHandler from "express-async-handler";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../helper/response.helper.js";
import User from "../../models/user.model.js";
import {
  validateEmail,
  validatePhoneNumber,
} from "../../helper/validator.helper.js";
import asyncHandler from "express-async-handler";
import { createToken } from "../../helper/jwt.helper.js";

const userRegister = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    dob,
    gender,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
  } = req.body;
  const requiredFields = {
    name,
    email,
    phoneNumber,
    password,
    dob,
    gender,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
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

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return sendErrorResponse(res, 400, "Email already exists");
  }

  if (!validatePhoneNumber(phoneNumber)) {
    return sendErrorResponse(res, 400, "Invalid phone number");
  }

  if (!validateEmail(email)) {
    return sendErrorResponse(res, 400, "Invalid email");
  }

  const newUser = new User({
    name,
    email,
    phoneNumber,
    password,
    dob,
    gender,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
  });

  await newUser.save();
  return sendSuccessResponse(res, 200, {}, "Account created successfully");
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendErrorResponse(res, 400, "Incomplete data");
  }

  const userExists = await User.findOne({ email });
  if (!userExists) {
    return sendErrorResponse(res, 400, "Account doesn't exists");
  }
  const isMatch = await userExists.comparePassword(password);
  if (!isMatch) {
    return sendErrorResponse(res, 400, "Invalid password");
  }
  const payload = {
    userId: userExists._id,
    name: userExists.name,
    email: userExists.email,
    phoneNumber: userExists.phoneNumber,
    dob: userExists.dob,
    gender: userExists.gender,
    address1: userExists.address1,
    address2: userExists.address2,
    country: userExists.country,
    state: userExists.state,
    city: userExists.city,
    pincode: userExists.pincode,
  };
  const token = createToken(payload);
  return sendSuccessResponse(
    res,
    200,
    { data: payload, token },
    "Logged in successfully"
  );
});

const userOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    productId,
    quantity,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
  } = req.body;
  const requiredFields = {
    userId,
    productId,
    quantity,
    address1,
    address2,
    country,
    state,
    city,
    pincode,
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
});

export { userRegister, userLogin };
