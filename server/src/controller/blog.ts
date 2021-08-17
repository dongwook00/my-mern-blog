import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import logging from "../config/logging";
import Blog from "../models/blog";

const create = (req: Request, res: Response, next: NextFunction) => {
  logging.info("Attempting to register blog ... ");
  let { author, title, content, headline, picture } = req.body;
  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
    content,
    headline,
    picture
  });

  return blog
    .save()
    .then((newBlog) => {
      logging.info(`New blog created...`);
      return res.status(201).json({ blog: newBlog })
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({ error });
    });
};

const read = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogID;
  logging.info(`Incoming read for ${_id} ...`);
  
  return Blog.findById(_id)
    .populate("author")
    .then((blog) => {
      if (blog) {
        return res.status(200).json({ blog });
      } else {
        return res.status(404).json({ message: "Not Found" });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error
      });
    });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
  logging.info(`Incoming read all ...`);
  return Blog.find()
    .populate("author")
    .exec()
    .then((blogs) => {
      return res.status(200).json({
        count: blogs.length,
        blogs
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error
      })
    })

};

const query = (req: Request, res: Response, next: NextFunction) => {
  logging.info("Incoming query ...");
  return Blog.find()
    .populate("author")
    .exec()
    .then((blogs) => {
      return res.status(200).json({
        count: blogs.length,
        blogs
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error
      })
    })
};

const update = (req: Request, res: Response, next: NextFunction) => {
  logging.info(`Update route called`);
  const _id = req.params.blogID;

  Blog.findById(_id)
    .exec()
    .then(blog => {
      if (blog) {
        blog.set(req.body);
        blog.save()
            .then((savedBlog) => {
              logging.info(`Blog with id ${_id} updated`);
              return res.status(201).json({ blog: savedBlog });
            })
            .catch((error) => {
              logging.error(error);
              return res.status(500).json({ message: error.message });
            });
      } else {
        return res.status(401).json({ message: "Not found" });
      }
    })
    .catch(error => {
      logging.error(error.message);
      return res.status(500).json({ message: error.message });
    })
};

const deleteBlog = (req: Request, res: Response, next: NextFunction) => {
  logging.warn("Delete route called");

  const _id = req.params.blogID;
  
  Blog.findByIdAndDelete(_id)
    .exec()
    .then(() => {
      return res.status(201).json({ message: "Blog deleted "});
    })
    .catch((error) => {
      logging.error(error.message)
      return res.status(500).json({
        message: error.message
      });
    });
};

export default {
  create,
  read,
  readAll,
  update,
  query,
  deleteBlog
}