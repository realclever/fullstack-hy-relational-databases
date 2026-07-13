const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

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

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);

    if (!readingList) {
      return res.status(404).json({
        error: "reading list not found",
      });
    }

    if (readingList.userId !== req.decodedToken.id) {
      return res.status(403).json({
        error: "forbidden",
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
