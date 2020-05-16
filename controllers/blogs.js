const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const token = request.token;
    const blog = new Blog(request.body);

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
      return response.status(400).json({
        error: "Missing or invalid token",
      });
    }

    if (!blog.likes) {
      blog.likes = 0;
    }

    if (!blog.title || !blog.url) {
      response.status(400).end();
    }

    const user = await User.findById(decodedToken.id);
    blog.user = user._id;

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const token = request.token;

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken.id) {
      return response.status(400).json({
        error: "Missing or invalid token",
      });
    }

    const blog = await Blog.findById(request.params.id);
    const user = await User.findOne({ username: decodedToken.username });

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({
        error: "Not allowed",
      });
    }

    await blog.delete();

    response.status(204).end();
  } catch (e) {
    next(e);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
  });
  response.json(blog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog.comments.push(request.body.comment);
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
