import mongoose from "mongoose";
import Variant from "../../../models/variant.model.js"; // Adjust the path as necessary
import Product from "../../../models/product.model.js";

// Add Variant Controller
const addVariant = async (req, res) => {
  const session = await mongoose.startSession(); // Start a new session
  session.startTransaction(); // Start a transaction

  try {
    const {
      productId,
      sku,
      price,
      quantity,
      attributes,
      weight,
      dimensions,
      status,
      discountedPrice,
      isDefault,
    } = req.body;
    const { imageThumbnail } = req.files;
    const { image } = req.files;

    // Check if the product exists
    const productExists = await Product.findById(productId).session(session);
    if (!productExists) {
      await session.abortTransaction(); // Abort the transaction if product not found
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    // If isDefault is true, update all other variants for the same product to have isDefault = false
    if (isDefault) {
      await Variant.updateMany(
        { productId: productId, isDefault: true }, // Find other variants with the same productId
        { $set: { isDefault: false } }, // Set their isDefault to false
        { session } // Ensure the operation is part of the session
      );
    }

    // Create a new variant object
    const newVariant = new Variant({
      productId,
      sku,
      price,
      quantity,
      attributes,
      imageThumbnail,
      image,
      weight,
      dimensions,
      status,
      discountedPrice,
      isDefault,
    });

    // Save the variant to the database
    const savedVariant = await newVariant.save({ session });

    // Commit the transaction after successful save
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Variant added successfully",
      variant: savedVariant,
    });
  } catch (error) {
    // If any error occurs, abort the transaction and rollback changes
    await session.abortTransaction();
    session.endSession();

    // Handle errors
    return res.status(500).json({
      message:
        "An error occurred while adding the variant, changes have been rolled back",
      error: error.message,
    });
  }
};

export { addVariant };
