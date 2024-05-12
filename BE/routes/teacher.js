const express = require("express");
const router = express.Router();
const { database } = require("../database/database");
const { hashPassword } = require("../service/user-service");
const {isBefore} = require("date-fns");
const teacherService = require("../service/teacher-service");


const ORDER = {
  USERNAME: "username",
  ROLE: "role",
};

router.get("/", async (req, res) => {
  const order = req.query.order;

  const reservationsCopy = await teacherService.getAll();

  let teachers;
  if (order === ORDER.USERNAME) {
    teachers = reservationsCopy.sort((a, b) => a.username.localeCompare(b.username));
  } else {
    teachers = reservationsCopy.sort((resA, resB) =>
        isBefore(new Date(resA.time), new Date(resB.time)) ? -1 : 0
    );
  }

  res.json(teachers);
});


module.exports = router;
