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

// Route
app.get("/", (req, res) => {
  res.send("This is the home");
});

// app.get("/translations/:lang", lokalise.getTranslations);
// Get 5 job agencies
app.get('/search', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.FOURSQUARE_API_KEY;

  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      params: {
        query: 'job-agencies',
        ll: `${lat},${lon}`,
        radius: 30000,
        limit: 5
      },
      headers: {
        Accept: 'application/json',
        Authorization: apiKey
      }
    });
    res.json(response.data);
    console.log('search-response:', response.data)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while searching for job agencies' });
  }
});
module.exports = app;
