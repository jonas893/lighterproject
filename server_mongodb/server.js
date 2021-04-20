const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost/mydb";
const PORT = 3000;

const app = express();

var corsOptions = {
  origin: [
    "https://localhost:8080",
    "http://localhost:8080",
    "https://127.0.0.1:8080",
    "http://127.0.0.1:8080",
  ],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded());
app.use(cors(corsOptions));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are connected");
});

app.get("/", (req, res) => {
  res.status(200).send("/");
});

const lighter = require("./routes/lighter");
app.use("/lighter", lighter);

app.get("*", (req, res) => {
  res.status(400).send({ message: "not found" });
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
});
