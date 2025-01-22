require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const dietRoutes = require("./routes/diet");

const app = express();

// Middleware
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chatbot", chatRoutes);
app.use("/api/diet", dietRoutes);

// Connect to DB and set up a basic route
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Serve a success message on the root route
    app.get("/", (req, res) => {
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: green;">Server Connected Successfully</h1>
            <p>The server is running on port ${process.env.PORT}.</p>
          </body>
        </html>
      `);
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);

    // Serve an error message on the root route
    app.get("/", (req, res) => {
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: red;">Server Connection Failed</h1>
            <p>Failed to connect to MongoDB: ${error.message}</p>
          </body>
        </html>
      `);
    });

    // Listen for requests even if DB connection fails
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on port ${process.env.PORT}, but there is an issue with the database connection`
      );
    });
  });
