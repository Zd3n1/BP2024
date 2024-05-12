const { database } = require('../database/database');

class ReservationService {
  async getAll() {
    const lessons = await database().all("SELECT * FROM lessons");
    return lessons;
  }

  async getById(id) {
    const result = await database().get(
        "SELECT * FROM lessons WHERE id = ?",
        id
    );
    return result;
  }

  async getQuizzes(id) {
    const quizzes = await database().all(
        "SELECT * FROM quezzis WHERE lessons_id = ?",
        id
    );
    return quizzes;
  }


  async getQuizzes1(id) {
    const quizzes = await database().all(
        "SELECT * FROM quezzis WHERE lessons_id = ?",
        id
    );
    return quizzes;
  }

  async getLessonTitle(id) {
    const title = await database().get(
        "SELECT title FROM lessons WHERE id = ?",
        id
    );
    return title;
  }



}



module.exports = new ReservationService();