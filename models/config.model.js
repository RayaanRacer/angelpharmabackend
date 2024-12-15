import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "airswag.in",
    },
    logo: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    contactNo: {
      type: Number,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    fb: {
      type: String,
      trim: true,
    },
    insta: {
      type: String,
      trim: true,
    },
    x: {
      type: String,
      trim: true,
    },
    yt: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    totalUser: {
      type: Number,
      default: 0,
    },
    totaOrders: {
      type: Number,
      default: 0,
    },
    totalPayments: {
      type: Number,
      default: 0,
    },
    totalVisits: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Config = mongoose.model("Config", configSchema);

export default Config;
