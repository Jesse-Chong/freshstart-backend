// Dependencies
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const lokalise = require("./lokalise");
const userController = require("./controllers/usersController");
const favoriteController = require("./controllers/favoriteController");
const usersFavoritesController = require("./controllers/usersFavorite");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/users", userController);
app.use("/favorite", favoriteController);
app.use("/users-favorites", usersFavoritesController)
const pool = new Pool({
  user: DB_USER,
  host: "localhost",
  database: "maps_places",
  password: DB_PASSWORD,
  port: 5432,
});

// Route
app.get("/", (req, res) => {
  res.send("This is the home");
});

app.get("/translations/:lang", lokalise.getTranslations);

module.exports = app;
