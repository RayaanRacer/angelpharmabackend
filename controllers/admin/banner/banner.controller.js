import asyncHandler from "express-async-handler";
import Banner from "../../../models/banner.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../helper/response.helper.js";
import { deleteImage } from "../../../helper/multer.helper.js";
import mongoose from "mongoose";

const addBanner = asyncHandler(async (req, res) => {
  const {
    bannerName,
    bannerBtnText,
    bannerBtnLink,
    order,
    status,
    bannerDescription,
  } = req.body;
  const { bannerImage } = req.files;
  const requiredFields = {
    bannerName,
    bannerBtnText,
    bannerBtnLink,
    order,
    status,
    bannerDescription,
    bannerImage,
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
  const maxOrderBanner = await Banner.findOne({}, { order: 1 })
    .sort({ order: -1 })
    .limit(1);
  const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;
  console.log(order);

  let newOrder = Number(order);
  if (newOrder >= maxOrder) {
    newOrder = maxOrder + 1; // set the new post's order to maxOrder + 1
  } else {
    await Banner.updateMany(
      { order: { $gte: newOrder } },
      { $inc: { order: 1 } }
    );
  }
  const newBanner = new Banner({
    bannerName,
    bannerBtnText,
    bannerBtnLink,
    order: newOrder,
    status,
    bannerDescription,
    bannerImage: bannerImage[0]?.filename,
  });
  await newBanner.save();
  return sendSuccessResponse(res, 200, {}, "Banner created successfully");
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Banner ID is required`);
  }
  let {
    bannerName,
    bannerBtnText,
    bannerBtnLink,
    order,
    status,
    bannerDescription,
  } = req.body;
  const { bannerImage } = req.files;
  const requiredFields = {
    bannerName,
    bannerBtnText,
    bannerBtnLink,
    order,
    status,
    bannerDescription,
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
  const isBannerExists = await Banner.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Banner not found`);
  }
  if (bannerImage !== "" && bannerImage !== undefined && bannerImage !== null) {
    requiredFields.bannerImage = bannerImage[0]?.filename;
  }
  if (isBannerExists.order != order) {
    const maxOrderBanner = await Banner.findOne({}, { order: 1 })
      .sort({ order: -1 })
      .limit(1);
    const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;

    let newOrder = order;
    if (newOrder >= maxOrder) {
      newOrder = maxOrder + 1; // set the new post's order to maxOrder + 1
    } else {
      await Banner.updateMany(
        { order: { $gte: newOrder } },
        { $inc: { order: 1 } }
      );
    }
  }
  await Banner.findByIdAndUpdate(id, requiredFields, { new: true });
  if (bannerImage !== "" && bannerImage !== undefined && bannerImage !== null) {
    deleteImage(isBannerExists.bannerImage);
  }
  return sendSuccessResponse(res, 200, {}, "Banner updated successfully");
});

const getBannerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Banner ID is required`);
  }
  const isBannerExists = await Banner.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Banner not found`);
  }

  return sendSuccessResponse(
    res,
    200,
    isBannerExists,
    "Banner get successfully"
  );
});

const getBannerList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, fromDate, toDate, keyword, status } = req.query;
  let query = {};
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      query.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      query.createdAt.$lte = new Date(toDate);
    }
  }
  if (keyword) {
    query.$or = [
      { bannerName: { $regex: keyword, $options: "i" } },
      { bannerDescription: { $regex: keyword, $options: "i" } },
    ];
  }

  // Filtering by status (published or not)
  if (status) {
    query.status = status; // Assuming status can be 'true' or 'false'
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };
  const banners = await Banner.paginate(query, options);
  // Response
  const data = {
    count: banners.totalDocs,
    totalPages: banners.totalPages,
    currentPage: banners.page,
    banners: banners.docs,
  };
  return sendSuccessResponse(res, 200, data, "Get banners successfully");
});

const toggleBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Banner ID is required`);
  }
  console.log(id);

  const isBannerExists = await Banner.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Banner not found`);
  }
  if (isBannerExists.status) {
    await Banner.findByIdAndUpdate(id, { status: false }, { new: true });
    return sendSuccessResponse(
      res,
      200,
      {},
      "Banner status changed to Inactive successfully"
    );
  }
  await Banner.findByIdAndUpdate(id, { status: true }, { new: true });
  return sendSuccessResponse(
    res,
    200,
    {},
    "Banner status changed to Active successfully"
  );
});

export { addBanner, updateBanner, getBannerById, getBannerList, toggleBanner };
