import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define the variant schema
const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  sku: {
    type: String,
    unique: true, // Stock Keeping Unit, must be unique
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  attributes: [
    {
      key: {
        type: String, // e.g., size, color
        required: true,
      },
      value: {
        type: String, // e.g., large, red
        required: true,
      },
    },
  ],
  imageThumbnail: {
    type: String, // URL to the variant-specific image
    trim: true,
  },
  image: {
    type: [String],
  },
  weight: {
    type: Number, // Optional: for shipping calculations
  },
  dimensions: {
    length: {
      type: Number, // Optional: in cm or any unit for shipping calculations
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  status: {
    type: Boolean,
    default: true, // Variant availability status
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  isDefault: {
    type: Boolean,
  },
});

// Create the variant model
productSchema.plugin(mongoosePaginate);
const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
