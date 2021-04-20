const express = require("express");
const router = express.Router();
const Lighter = require("../models/lighter.js");

//GET all Lighter
router.get("/", async (req, res) => {
  console.log("---- GET all Lighter ----");
  try {
    const data = await Lighter.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET LIGHTER BY ID
router.get("/:id", getLighter, (req, res) => {
  console.log("---- GET LIGHTER BY ID ----");
  res.send(res.lighter);
});

//POST NEW LIGHTER
router.post("/", async (req, res) => {
  console.log("---- POST NEW LIGHTER ----");
  const lighter = new Lighter({
    color: req.body.color,
    id: req.body.id,
  });
  try {
    const newLighter = await lighter.save();
    res.status(201).json(lighter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//POST MULTIPLE LIGHTERS
router.post("/multiple", async (req, res) => {
  console.log("---- POST MULTIPLE LIGHTER ----");
  for (var i = 0; i < req.body.length; i++) {
    const lighter = new Lighter({
      color: req.body[i].color,
      id: req.body[i].id,
      position: req.body[i].position,
    });
    const newLighter = await lighter.save();
  }
  try {
    res
      .status(201)
      .json({ status: "201. Save -" + req.body.length + "- lighter." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//PATCH LIGHTER BY ID
router.patch("/:id", getLighter, async (req, res) => {
  console.log("---- PATCH LIGHTER BY ID ----");
  if (req.body.color != null) {
    res.lighter.color = req.body.color;
  }
  if (req.body.position != null) {
    res.lighter.position = req.body.position;
  }
  try {
    const updateLighter = await res.lighter.save();
    res.json(updateLighter);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//GET lighter by Lighter ID and next()
async function getLighter(req, res, next) {
  try {
    lighter = await Lighter.findOne({ id: req.params.id });
    if (lighter == null) {
      return res.status(404).json({ message: "Cannot find Lighter" });
    }
  } catch (err) {
    return res.status(404).json({ message: "Cannot find Lighter" });
  }
  res.lighter = lighter;
  next();
}

module.exports = router;
