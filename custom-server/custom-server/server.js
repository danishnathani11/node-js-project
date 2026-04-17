
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages", "home"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages", "about"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages", "contact"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});