const express = require("express");
const router = express.Router();
const userService = require("../service/user-service");
const { database } = require("../database/database");
const { hashPassword } = require("../service/user-service");
const { comparePassword } = require("../service/user-service");
const courseService = require("../service/course-service");
const {isBefore} = require("date-fns");
const teacherService = require("../service/teacher-service");
const {passwordConfig} = require("../config");


router.post("/login", async (req, res) => {
  try {
    const user = await userService.getByUsername(req.body.username);
    if (!user) {
      return res.status(401).send("Username not found");
    }

    if (userService.hashPassword(req.body.password) !== user.password) {
        return res.status(401).send("Invalid password dumbo");
    }

    const token = userService.generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
});





router.get('/:id/username', async (req, res) => {
  console.log("Fetching username for ID:", req.params.id);
  try {
    const username = await userService.getUsername(req.params.id);
    console.log("Username fetched:", username);
    if (!username) {
      return res.status(404).json({ error: "Username not found" });
    }
    res.json({ username });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).send({ error: error.message });
  }
});


const ORDER = {
  USERNAME: "username",
  ROLE: "role",
};

router.get("/", async (req, res) => {
  const order = req.query.order;

  const reservationsCopy = await teacherService.getAll();

  let users;
  if (order === ORDER.USERNAME) {
    users = reservationsCopy.sort((a, b) => a.username.localeCompare(b.username));
  } else {
    users = reservationsCopy.sort((resA, resB) =>
        isBefore(new Date(resA.time), new Date(resB.time)) ? -1 : 0
    );
  }

  res.json(users);
});


// router.post("/:id/:score", async (req, res) => {
//   const score = await userService.AddScore(req.params.id, req.params.score);
//   console.log("Score added:", score);
//
//   if (!score) {
//     return res.status(404).json({ error: "User not found" });
//   } else {
//     res.json(score);
//   }
// });

router.post("/:id/:score", async (req, res) => {
  const userId = req.params.id;
  const score = parseInt(req.params.score, 10);

  if (isNaN(score)) {
    return res.status(400).json({ error: "Invalid score format" });
  }

  try {
    const result = await userService.AddScore(userId, score);
    if (result && result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Score added:", score);
    res.json({ success: true, score: score });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
