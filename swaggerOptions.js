export const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI specification version
    info: {
      title: "My API", // API Title
      version: "1.0.0", // API version
      description: "API documentation using Swagger UI", // Short description
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply Bearer Token globally to all endpoints
      },
    ],
    servers: [
      {
        url: `http://localhost:4000`, // Your base URL
      },
    ],
  },
  apis: [
    "./routes/admin/auth/admin.auth.routes.js",
    "./routes/admin/config/admin.config.routes.js",
    "./routes/admin/banner/admin.banner.routes.js",
    "./routes/admin/testimonial/admin.testimonial.routes.js",
    "./routes/admin/products/admin.products.routes.js",
  ], // Path to the API docs (this includes your routes)
};
