import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      trim: true,
    },
    specification: {
      type: String,
      trim: true,
    },
    uses: {
      type: [String],
      trim: true,
    },
    thumbnail1: {
      type: String,
      trim: true,
    },
    thumbnail2: {
      type: String,
      trim: true,
    },
    actualPrice: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    taxPercent: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    minQuantity: {
      type: Number,
      default: 0,
    },
    maxQuantity: {
      type: Number,
      default: 0,
    },
    currentAvailableQuantity: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);
productSchema.plugin(aggregatePaginate);
const Product = mongoose.model("Product", productSchema);

export default Product;
