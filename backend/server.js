const express = require("express");
const notes = require("./data/data");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const app = express();
connectDB();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`server is listening at port: ${process.env.PORT}`);
});
