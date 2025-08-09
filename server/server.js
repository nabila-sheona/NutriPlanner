require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./Routes/user.route");
const authRoute = require("./Routes/auth.route");
const recipeRoute = require("./Routes/recipe.route");
const mealplanRoute = require("./Namisa/Routes/mealPlanRoutes");
const mealplanrecipeRoute = require("./Namisa/Routes/mealPlanRecipeRoutes");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const createError = require("./utils/createError");

const app = express();

app.use(morgan("combined"));

app.use(helmet());

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/recipes", recipeRoute);
app.use("/mealplans", mealplanRoute);
app.use("/mealplanrecipes", mealplanrecipeRoute);
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
  });

app.all("*", (req, res, next) => {
  next(createError(404, `Cannot find ${req.originalUrl} on this server!`));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res
    .status(err.status || 500)
    .json({ error: err.message || "Something went wrong!" });
});
