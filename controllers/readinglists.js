const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;

    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    if (!blog) {
      return res.status(400).json({
        error: "blog not found",
      });
    }

    const readingList = await ReadingList.create({
      userId,
      blogId,
    });

    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
