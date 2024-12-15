import multer from "multer";
import path from "path";
import fs from "fs";

// Helper function for multer configuration
const imageUploadHelper = (destinationPath) => {
  // Configure storage for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath); // Set destination folder
    },
    filename: (req, file, cb) => {
      // Create unique file name using timestamp and original extension
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Save with custom name
    },
  });

  // File filtering function to accept only images
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  };

  // Multer setup: multiple files, limit file size to 5MB
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }).fields([
    { name: "webImage", maxCount: 1 },
    { name: "appImage", maxCount: 1 },
    { name: "icon", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "postThumbnail", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "thumbnail1", maxCount: 1 },
    { name: "thumbnail2", maxCount: 1 },
  ]);

  return upload;
};

// Example usage in route handler
const uploadImages = imageUploadHelper("./uploads/images");

const deleteImage = (image) => {
  const imagePath = "./uploads/images/" + image;
  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Delete the file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting the file: ${err}`);
      } else {
        console.log(`File deleted: ${imagePath}`);
      }
    });
  } else {
    console.log("File not found, cannot delete.");
  }
};

export { uploadImages, deleteImage };
