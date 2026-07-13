const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({
        error: "userId and blogId are required",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res.status(404).json({
        error: "blog not found",
      });
    }

    const existingEntry = await ReadingList.findOne({
      where: {
        userId,
        blogId,
      },
    });

    if (existingEntry) {
      return res.status(400).json({
        error: "blog already in reading list",
      });
    }

    const readingList = await ReadingList.create({
      userId,
      blogId,
    });

    res.json({
      id: readingList.id,
      user_id: readingList.userId,
      blog_id: readingList.blogId,
      read: readingList.read,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);

    if (!readingList) {
      return res.status(404).json({
        error: "reading list not found",
      });
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: "unauthorized",
      });
    }

    if (typeof req.body.read !== "boolean") {
      return res.status(400).json({
        error: "read must be a boolean",
      });
    }

    readingList.read = req.body.read;
    await readingList.save();

    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
