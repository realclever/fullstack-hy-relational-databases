const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  });

  res.json(users);
});

router.get("/:id", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.read !== undefined) {
      where.read = req.query.read === "true";
    }

    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: "readings",
        through: {
          attributes: ["read", "id"],
          where,
        },
      },
    });

    if (!user) {
      return res.status(404).end();
    }

    res.json({
      name: user.name,
      username: user.username,
      readings: user.readings,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (user) {
      user.name = req.body.name;
      await user.save();
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
