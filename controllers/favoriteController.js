const express = require("express");
const favoritepractice = express.Router();
const {
  getAllFavorites,
  getFavorite,
  createFavorite,
  updateFavorite,
  deleteFavorite,
} = require("../queries/favorite.js");

favoritepractice.get("/", async (req, res) => {
  const allFavorite = await getAllFavorites();
  console.log(allFavorite);
  if (allFavorite[0]) {
    res.status(200).json(allFavorite);
  } else {
    res.status(500).json({ error: "server error" });
  }
});

favoritepractice.get("/:id", async (req, res) => {
  const { id } = req.params;
  // const oneFavorite = await getFavorite(id);
  // if (oneFavorite) {
  //   res.status(200).json(oneFavorite);
  // } else {
  //   res.status(404).json({ error: "Not Found" });
  // }
  try {
    const oneFavorite = await getFavorite(id);
    res.status(200).json(oneFavorite);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

favoritepractice.post("/", async (req, res) => {
  const body = req.body;
  const document = await createFavorite(body);
  res.status(200).json(document);
});

favoritepractice.delete("/:id", async (req, res) => {
  // const { id } = req.params;
  // const deletedfavorite = await deleteFavorite(id);
  // if (deletedfavorite.id) {
  //   res.status(200).json(deletedfavorite);
  // } else {
  //   res.status(404).json({ error: "Not Found" });
  // }
  try {
    const { id } = req.params;
    const deletedfavorite = await deleteFavorite(id);
    res.status(200).json({ message: "Successfully deleted task" });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

favoritepractice.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const updatedFavorite = await updateFavorite(id, body);
  if (updatedFavorite.id) {
    res.status(200).json(updatedFavorite);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

module.exports = favoritepractice;