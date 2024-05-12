const express = require("express");
const router = express.Router();
const { database } = require("../database/database");
const lessonService = require("../service/lesson-service");

// const ORDER = {
//   TITLE: "title",
//   DESCRIPTION: "description",
// };
//
// router.get("/", async (req, res) => {
//   const order = req.query.order;
//
//   const reservationsCopy = await courseService.getAll();
//
//   let courses;
//   if (order === ORDER.TITLE) {
//     courses = reservationsCopy.sort((resA, resB) =>
//       resA.description - resB.description > 0 ? 0 : -1
//     );
//   } else {
//     courses = reservationsCopy.sort((resA, resB) =>
//       isBefore(new Date(resA.time), new Date(resB.time)) ? -1 : 0
//     );
//   }
//
//   res.json(courses);
// });

router.get("/", async (req, res) => {
  try {
    const lessons = await lessonService.getAll();
    res.json(lessons);
  } catch (error) {
    console.error("Failed to load lessons:", error);
    res.status(500).json({ error: "Failed to load lessons" });
  }
});

router.get("/:id/quiz", async (req, res) => {
  try {
    const quizzes = await lessonService.getQuizzes(req.params.id);
    res.json(quizzes);
  } catch (error) {
    console.error("Failed to load quizzes:", error);
    res.status(500).json({ error: "Failed to load quizz" });
  }
});

router.get("/:id/quiz1", async (req, res) => {
  try {
    const quizzes = await lessonService.getQuizzes1(req.params.id);
    res.json(quizzes);
  } catch (error) {
    console.error("Failed to load quizzes:", error);
    res.status(500).json({ error: "Failed to load quizz" });
  }
});

//nacitat jen jednu otazku a jet je postupne podle poctu co dostanu z countu

router.get("/:id/title", async (req, res) => {
    try {
        const title = await lessonService.getLessonTitle(req.params.id);
        res.json(title);
    } catch (error) {
        console.error("Failed to load title:", error);
        res.status(500).json({ error: "Failed to load title" });
    }
});


// router.post("/", async (req, res) => {
//   const data = req.body;
//
//   if (
//       data.title === undefined ||
//       data.title.trim() === "",
//     data.description === undefined ||
//     data.description.trim() === ""
//   ) {
//     res.status(400).send("Bad input");
//     return;
//   }
//
//   const response = await courseService.create(data);
//
//   res.status(201).json(response);
// });




module.exports = router;
