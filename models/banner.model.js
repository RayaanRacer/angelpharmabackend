import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const bannerSchema = new mongoose.Schema(
  {
    bannerName: {
      type: String,
      default: "airswag.in",
    },
    bannerImage: {
      type: String,
      trim: true,
    },
    bannerBtnText: {
      type: String,
      trime: true,
    },
    bannerBtnLink: {
      type: String,
      trime: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    bannerDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
bannerSchema.plugin(mongoosePaginate);
const Banner = mongoose.model("banner", bannerSchema);

export default Banner;
