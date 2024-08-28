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
app.use("/users-favorites", usersFavoritesController);

// Route
app.get("/", (req, res) => {
  res.send("This is the home");
});

// app.get("/translations/:lang", lokalise.getTranslations);
// Get 5 job agencies
app.get("/search", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.FOURSQUARE_API_KEY;

  try {
    const response = await axios.get(
      "https://api.foursquare.com/v3/places/search",
      {
        params: {
          query: "job-agencies",
          ll: `${lat},${lon}`,
          radius: 30000,
          limit: 5
        },
        headers: {
          Accept: "application/json",
          Authorization: apiKey
        },
      }
    );
    res.json(response.data);
    console.log("search-response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "An error occurred while searching for job agencies" });
  }
});

// Get the details of the job agencies
app.get("/place-details", async (req, res) => {
  const { fsq_id } = req.query;
  const apiKey = process.env.FOURSQUARE_API_KEY;

  try {
    const response = await axios.get(
      `https://api.foursquare.com/v3/places/${fsq_id}`,
      {
        params: {
          fields: "name,location,tel,website,hours,photos"
        },
        headers: {
          Accept: "application/json",
          Authorization: apiKey
        },
      }
    );

    const placeData = response.data;
    const placeDetails = {
      name: placeData.name || "Not available",
      address: placeData.location?.formatted_address || "Address not provided",
      phone: placeData.tel || "Phone number not provided",
      website: placeData.website || "Website not available",
      openingHours: placeData.hours?.display || "Opening hours not provided",
      photos:
        placeData.photos?.map(
          (photo) => `${photo.prefix}original${photo.suffix}`
        ) || []
    };
    res.json(placeDetails);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: "An error occurred while fetching place details" });
  }
});

// Route user
app.get('/route', async (req, res) => {
  const { origin, destination, transportMode, return: returnParam } = req.query;
  const apiKey = process.env.HERE_API_KEY;

  let url;
  let params;

  if (transportMode === 'publicTransport') {
    url = `https://transit.router.hereapi.com/v8/routes`;
    params = {
      apiKey,
      origin,
      destination,
      return: returnParam || "polyline,actions,fares"
    };
  } else {
    url = `https://router.hereapi.com/v8/routes`;
    params = {
      apiKey,
      origin,
      destination,
      transportMode,
      routingMode: 'fast',
      'avoid[features]': 'ferry',
      return: returnParam || "polyline,actions,instructions"
    };
  }
  try {
    const response = await axios.get(url, { params });
    const route = response.data.routes[0];

    if (route && route.sections && route.sections.length > 0) {
      return res.json(response.data);
    } else {
      res.status(404).json({ message: 'No valid route found.' });
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while fetching the route.' });
  }
});
module.exports = app;
