const express = require("express");
const app = express();
const { initializeDatabase } = require("./database/database");
const jwt = require("express-jwt");
const { jwtConfig } = require("./config");
const homepageRouter = require("./routes/homepage");
const userRouter = require("./routes/user");
const reservationRouter = require("./routes/reservation");
const courseRouter = require("./routes/course");
const cors = require("cors");
const config = require("./config");
const teacherRouter = require("./routes/teacher");
const lessonRouter = require("./routes/lesson");



initializeDatabase();
app.use(express.json());
app.use(cors({ origin: config.allowedFrontendOrigin }));


app.use("/", homepageRouter);
app.use("/user", userRouter);
app.use("/reservation", reservationRouter);
app.use("/course",courseRouter);
app.use("/teacher",teacherRouter);
// app.use("/teacher",jwt(jwtConfig));
app.use("/admin",jwt(jwtConfig));
app.use("/lesson",lessonRouter);


const port = 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
