import express from "express";
import controller from "../controller/blog";

const router = express.Router();

router.get("/", controller.readAll);
router.get("/read/:blogID", controller.read);
router.post("/create", controller.create);
router.post("/query", controller.query);
router.patch("/update/:blogID", controller.update);
router.delete("/:blogID", controller.deleteBlog);

export = router;
