import mongoose from "mongoose";

const newArrivalSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "products",
  },
  status: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const NewArrival = mongoose.model("newArrival", newArrivalSchema);

export default NewArrival;
