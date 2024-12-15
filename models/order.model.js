import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "CANCELLED", "SHIPPED", "DELIVERED"],
      default: "PENDING",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "BANK", "PAYPAL"],
      default: "CASH",
    },
    paymentDetails: {
      type: String,
    },
    currentAdminStatus: {
      type: String,
      trim: true,
    },
    currentUserStatus: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(aggregatePaginate);
const Order = mongoose.model("Order", orderSchema);

export default Order;
