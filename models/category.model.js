import mongoose from "mongoose";

// Define the schema for Category
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      // unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [50, "Category name must be at most 50 characters long"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // Automatically generate a slug based on the category name
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to another category, for hierarchical structure
      default: null,
    },
    icon: {
      type: String,
      trim: true,
      default: "",
      // Optionally store an icon URL or reference for this category
    },
    webImage: {
      type: String,
      trim: true,
      default: "",
      // Optionally store an icon URL or reference for this category
    },
    appImage: {
      type: String,
      trim: true,
      default: "",
      // Optionally store an icon URL or reference for this category
    },
    bgColor: {
      type: String,
      trim: true,
      default: "",
      // Optionally store an icon URL or reference for this category
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      // Indicates whether this category is visible to users or hidden
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true, // Reference to the user who created the category
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      // Optional field to track the last user who updated the category
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

// Middleware to automatically generate a slug before saving
// categorySchema.pre("save", function (next) {
//   if (!this.isModified("name")) {
//     return next();
//   }
//   this.slug = this.name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, ""); // Convert name to a URL-friendly slug
//   next();
// });

// Middleware to update the `updatedAt` field on modification
categorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Indexing: Add an index for faster search by name or slug

const Category = mongoose.model("Category", categorySchema);

export default Category;
