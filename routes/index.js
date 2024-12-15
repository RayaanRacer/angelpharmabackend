import adminRoutes from "./admin/auth/admin.auth.routes.js";
import configRoutes from "./admin/config/admin.config.routes.js";
import bannerRoutes from "./admin/banner/admin.banner.routes.js";
import testimonialRoutes from "./admin/testimonial/admin.testimonial.routes.js";
import productsRoutes from "./admin/products/admin.products.routes.js";
import frontRoutes from "./front/front.routes.js";
import userRoutes from "./user/auth/user.auth.routes.js";
// import adminPostRoutes from "./admin/posts/posts.routes.js";
import { API_VERSION } from "../constants/apiConsants.js";

const routes = (app) => {
  app.use(`${API_VERSION}/admin`, adminRoutes);
  app.use(`${API_VERSION}/admin`, configRoutes);
  app.use(`${API_VERSION}/admin`, bannerRoutes);
  app.use(`${API_VERSION}/admin`, testimonialRoutes);
  app.use(`${API_VERSION}/admin`, productsRoutes);
  app.use(`${API_VERSION}/front`, frontRoutes);
  app.use(`${API_VERSION}/user`, userRoutes);
  // app.use(`${API_VERSION}/admin/posts`, adminPostRoutes);
};

export default routes;
