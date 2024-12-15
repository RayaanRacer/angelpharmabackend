import asyncHandler from "express-async-handler";
import Banner from "../../../models/banner.model.js";
import Testimonial from "../../../models/testimonial.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../../helper/response.helper.js";
import { deleteImage } from "../../../helper/multer.helper.js";

const addTestimonial = asyncHandler(async (req, res) => {
  const { name, text, color, order, status, rating } = req.body;
  const { image } = req.files;
  const requiredFields = {
    name,
    text,
    color,
    order,
    status,
    rating,
    image,
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
  const maxOrderBanner = await Testimonial.findOne({}, { order: 1 })
    .sort({ order: -1 })
    .limit(1);
  const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;
  let newOrder = Number(order);
  if (newOrder >= maxOrder) {
    newOrder = maxOrder + 1; // set the new post's order to maxOrder + 1
  } else {
    await Testimonial.updateMany(
      { order: { $gte: newOrder } },
      { $inc: { order: 1 } }
    );
  }
  const newBanner = new Testimonial({
    name,
    text,
    color,
    order: newOrder,
    status,
    rating,
    image: image[0]?.filename,
  });
  await newBanner.save();
  return sendSuccessResponse(res, 200, {}, "Testimonial created successfully");
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Testimonial ID is required`);
  }
  let { name, text, color, order, status, rating } = req.body;
  const { image } = req.files;
  const requiredFields = {
    name,
    text,
    color,
    order,
    status,
    rating,
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
  const isBannerExists = await Testimonial.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Testimonial not found`);
  }
  if (image !== "" && image !== undefined && image !== null) {
    requiredFields.image = image[0]?.filename;
  }
  if (isBannerExists.order != order) {
    const maxOrderBanner = await Testimonial.findOne({}, { order: 1 })
      .sort({ order: -1 })
      .limit(1);
    const maxOrder = maxOrderBanner ? maxOrderBanner.order : 0;

    let newOrder = order;
    if (newOrder >= maxOrder) {
      newOrder = maxOrder + 1; // set the new post's order to maxOrder + 1
    } else {
      await Testimonial.updateMany(
        { order: { $gte: newOrder } },
        { $inc: { order: 1 } }
      );
    }
  }
  await Testimonial.findByIdAndUpdate(id, requiredFields, { new: true });
  if (image !== "" && image !== undefined && image !== null) {
    deleteImage(isBannerExists.image);
  }
  return sendSuccessResponse(res, 200, {}, "Testimonial updated successfully");
});

const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Testimonial ID is required`);
  }
  const isBannerExists = await Testimonial.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Testimonial not found`);
  }

  return sendSuccessResponse(
    res,
    200,
    isBannerExists,
    "Testimonial get successfully"
  );
});

const getTestimonialList = asyncHandler(async (req, res) => {
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
      { name: { $regex: keyword, $options: "i" } },
      { rating: { $regex: keyword, $options: "i" } },
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
  const banners = await Testimonial.paginate(query, options);
  // Response
  const data = {
    count: banners.totalDocs,
    totalPages: banners.totalPages,
    currentPage: banners.page,
    testimonials: banners.docs,
  };
  return sendSuccessResponse(res, 200, data, "Get Testimonials successfully");
});

const toggleTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, `Testimonial ID is required`);
  }
  const isBannerExists = await Testimonial.findById(id);
  if (!isBannerExists) {
    return sendErrorResponse(res, 400, `Testimonial not found`);
  }
  if (isBannerExists.status) {
    await Testimonial.findByIdAndUpdate(id, { status: false }, { new: true });
    return sendSuccessResponse(
      res,
      200,
      {},
      "Testimonial status changed to Inactive successfully"
    );
  }
  await Testimonial.findByIdAndUpdate(id, { status: true }, { new: true });
  return sendSuccessResponse(
    res,
    200,
    {},
    "Testimonial status changed to Active successfully"
  );
});

export {
  addTestimonial,
  updateTestimonial,
  getTestimonialById,
  getTestimonialList,
  toggleTestimonial,
};
