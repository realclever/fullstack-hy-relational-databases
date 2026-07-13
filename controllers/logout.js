const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res, next) => {
  try {
    await req.session.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
