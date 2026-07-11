const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { Blog, User } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  }

  const blogs = await Blog.findAll({
    where,
    include: {
      model: User,
      attributes: ["name", "username"],
    },
  });

  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
    });

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (blog) {
      blog.likes = req.body.likes;
      await blog.save();
      res.json(blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).end();
    }

    if (blog.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: "only the creator can delete this blog",
      });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
