import asyncHandler from "express-async-handler";
import Config from "../../../models/config.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../helper/response.helper.js";
import { deleteImage } from "../../../helper/multer.helper.js";

const configUpdate = asyncHandler(async (req, res) => {
  let { logo } = req.files;
  let {
    sitename,
    email,
    contactNo,
    url,
    color,
    fb,
    insta,
    x,
    yt,
    linkedin,
    totalUser,
    totalOrders,
    totalPayments,
    totalVisits,
    changeCounts,
  } = req.body;
  const requiredFields = {
    sitename,
    email,
    contactNo,
    url,
    color,
    fb,
    insta,
    x,
    yt,
    linkedin,
    totalUser,
    totalOrders,
    totalPayments,
    totalVisits,
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
  const isConfigExists = await Config.findOne({});
  if (!isConfigExists) {
    if (!logo) {
      return sendErrorResponse(
        res,
        400,
        `Invalid or incomplete data: Missing fields : logo`
      );
    }
    requiredFields.logo = logo[0].filename;
    const newConfig = new Config(requiredFields);
    await newConfig.save();
    return sendSuccessResponse(res, 200, {}, "Config updated successfully");
  }
  if (changeCounts === true) {
    requiredFields.totalUser = totalUser;
    requiredFields.totalOrders = totalOrders;
    requiredFields.totalPayments = totalPayments;
    requiredFields.totalVisits = totalVisits;
  }
  if (logo !== "" && logo !== undefined && logo !== null) {
    requiredFields.logo = logo[0].filename;
  }
  const finalResult = await Config.findByIdAndUpdate(
    isConfigExists._id,
    requiredFields,
    { new: true }
  );
  if (logo !== "" && logo !== undefined && logo !== null) {
    deleteImage(isConfigExists.logo);
  }
  return sendSuccessResponse(
    res,
    200,
    finalResult,
    "Config updated successfully"
  );
});

const GetConfigById = asyncHandler(async (req, res) => {
  const config = await Config.findOne();
  return sendSuccessResponse(res, 200, config, "Config updated successfully");
});

export { configUpdate, GetConfigById };
