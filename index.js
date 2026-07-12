const express = require("express");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const { errorHandler } = require("./util/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const resetRouter = require("./controllers/reset");
const readingListsRouter = require("./controllers/readinglists");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).end();
});

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/reset", resetRouter);
app.use("/api/readinglists", readingListsRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
