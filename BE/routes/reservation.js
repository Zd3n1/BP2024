const express = require("express");
const router = express.Router();
const reservationService = require("../service/reservation-service");
const { isBefore } = require("date-fns");

// const ORDER = {
//   TIME: "time",
//   DURATION: "duration",
// };
//
// router.get("/", async (req, res) => {
//   const order = req.query.order;
//
//   const reservationsCopy = await reservationService.getAll();
//
//   let reservations;
//   if (order === ORDER.DURATION) {
//     reservations = reservationsCopy.sort((resA, resB) =>
//       resA.duration - resB.duration > 0 ? 0 : -1
//     );
//   } else {
//     reservations = reservationsCopy.sort((resA, resB) =>
//       isBefore(new Date(resA.time), new Date(resB.time)) ? -1 : 0
//     );
//   }
//
//   res.json(reservations);
// });

router.get("/", async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    res.json(reservations);
  } catch (error) {
    console.error("Failed to load reservations:", error);
    res.status(500).json({ error: "Failed to load reservations" });
  }
});


router.post("/", async (req, res) => {
  const data = req.body;

  if (
    data.time === undefined ||
    data.time.trim() === "" ||
    data.duration === undefined ||
    data.duration === 0 ||
    data.description === undefined ||
    data.description.trim() === ""
  ) {
    res.status(400).send("Bad input");
    return;
  }

  const response = await reservationService.create(data);

  res.status(201).json(response);
});


router.get("/users/:id/username", async (req, res) => {
  const id = req.params.id;
  try {
    const username = await reservationService.getUsername(id);
    const role = await reservationService.getRole(id);
    res.json({ username, role });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// not necessary


router.get("/user/:id/username", async (req, res) => {
  try {
    const username = await reservationService.getUsername(req.params.id);
    const role = await reservationService.getRole(id);
    if (!username) {
      res.status(404).json({ error: "Username not found" });
    } else {
      res.json({ username, role });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const deletionResult = await reservationService.delete(reservationId);

    if (deletionResult === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});

router.delete("/yeetUser/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const deletionResult = await reservationService.deletedUser(userId);

        if (deletionResult === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Users reservations deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({error: "Failed to delete users reservations"});
    }
});

module.exports = router;