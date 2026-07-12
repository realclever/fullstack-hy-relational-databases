const { Sequelize } = require("sequelize");
const { DATABASE_URL, TEST_DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const databaseUrl =
  process.env.TESTING === "true" ? TEST_DATABASE_URL : DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({
    sequelize,
    tableName: "migrations",
  }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();

  console.log("Migrations up to date", {
    files: migrations.map((migration) => migration.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("connected to the database");
  } catch (error) {
    console.log("failed to connect to the database");
    console.log(error);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
