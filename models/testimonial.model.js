import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  rating: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    trim: true,
  },
  status: {
    type: Boolean,
    trim: true,
  },
});

testimonialSchema.plugin(mongoosePaginate);
const Testimonial = mongoose.model("testimonial", testimonialSchema);

export default Testimonial;
