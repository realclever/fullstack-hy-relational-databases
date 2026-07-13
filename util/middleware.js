const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({
      error: "token missing",
    });
  }

  const token = authorization.substring(7);

  try {
    req.decodedToken = jwt.verify(token, SECRET);

    const session = await Session.findOne({
      where: {
        token,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "token invalid",
      });
    }

    const user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res.status(401).json({
        error: "token invalid",
      });
    }

    if (user.disabled) {
      return res.status(401).json({
        error: "account disabled, please contact admin",
      });
    }

    req.session = session;
    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      error: "token invalid",
    });
  }
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      error: error.errors.map((validationError) => validationError.message),
    });
  }

  return res.status(400).json({ error: error.message });
};

module.exports = {
  tokenExtractor,
  errorHandler,
};
