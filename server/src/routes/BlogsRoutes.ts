import express from "express";
import { BlogsController } from "../controllers/blogs/BlogsController";
import { userAuthentication } from "../middlewares/userAuthentication";
import { uploadSectionImages } from "../middlewares/uploadImages";
import { authorizedRoles } from "../middlewares/authorizedRoles";
const router = express.Router();

router.post(
  "/",
  uploadSectionImages,
  userAuthentication,
  authorizedRoles("admin", "user"),
  BlogsController.createBlog
);

router.get(
  "/:slug",
  userAuthentication,
  authorizedRoles("admin", "user"),
  BlogsController.getBlogById
);

router.delete(
  "/:slug",
  userAuthentication,
  authorizedRoles("admin", "user"),
  BlogsController.deleteBlogById
);

router.get("/", BlogsController.getAllBlogs);

export default router;
