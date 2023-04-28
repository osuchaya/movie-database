const { v4: uuidv4 } = require("uuid");
const express = require("express");
const apiRouter = express.Router({ mergeParams: true });
// Import your database connection and helper functions here
const db = require("./db");
const {
  getAllMovies,
  getMovieReviews,
  addMovie,
  deleteMovie,
  updateReview,
} = require("./controller");
// GET Route for retrieving all the movies
apiRouter.get("/api/movies", async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).json("Error retrieving movies");
  }
});
// GET Route for retrieving movie reviews and the associated movie name
apiRouter.get("/api/movie-reviews", async (req, res) => {
  try {
    const movieReviews = await getMovieReviews();
    res.json(movieReviews);
  } catch (err) {
    res.status(500).json("Error retrieving movie reviews");
  }
});
// POST Route for adding a new movie
apiRouter.post("/api/add-movie", async (req, res) => {
  const { title } = req.body;
  if (title) {
    try {
      const movieId = uuidv4();
      await addMovie(movieId, title);
      res.json("Movie added successfully");
    } catch (err) {
      res.status(500).json("Error adding movie");
    }
  } else {
    res.status(400).json("Invalid movie data");
  }
});
// DELETE Route for deleting a movie
apiRouter.delete("/api/movie/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    await deleteMovie(movieId);
    res.json("Movie with ID ${movieId} has been deleted");
  } catch (err) {
    res.status(500).json("Error deleting movie");
  }
});
// PUT Route for updating a review
apiRouter.put("/api/review/:id", async (req, res) => {
  const reviewId = req.params.id;
  const { movieId, content, rating } = req.body;
  if (movieId && content && typeof rating === "number") {
    try {
      await updateReview(reviewId, movieId, content, rating);
      res.json("Review with ID ${reviewId} has been updated");
    } catch (err) {
      res.status(500).json("Error updating review");
    }
  } else {
    res.status(400).json("Invalid review data");
  }
});
module.exports = apiRouter;