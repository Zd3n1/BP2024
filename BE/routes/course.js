const express = require("express");
const router = express.Router();
const { database } = require("../database/database");
const courseService = require("../service/course-service");
const { isBefore } = require("date-fns");

const ORDER = {
  TITLE: "title",
  DESCRIPTION: "description",
};

router.get("/", async (req, res) => {
  const order = req.query.order;

  const reservationsCopy = await courseService.getAll();

  let courses;
  if (order === ORDER.TITLE) {
    courses = reservationsCopy.sort((resA, resB) =>
      resA.description - resB.description > 0 ? 0 : -1
    );
  } else {
    courses = reservationsCopy.sort((resA, resB) =>
      isBefore(new Date(resA.time), new Date(resB.time)) ? -1 : 0
    );
  }

  res.json(courses);
});

router.post("/", async (req, res) => {
  const data = req.body;

  if (
      data.title === undefined ||
      data.title.trim() === "",
    data.description === undefined ||
    data.description.trim() === ""
  ) {
    res.status(400).send("Bad input");
    return;
  }

  const response = await courseService.create(data);

  res.status(201).json(response);
});




module.exports = router;
