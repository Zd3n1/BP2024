const { database } = require("../database/database");

class CourseService {
  async getAll() {
    const courses = await database().all("SELECT * FROM courses");
    return courses;
  }

  async create(course) {
    const result = await database().run(
      "INSERT INTO  courses (title, description, id) VALUES (?, ?, ?)",
      course.title,
      course.description,
      course.id
    );
    return await this.getById(result.lastID);
  }

  async getById(id) {
    const result = await database().get(
      "SELECT * FROM courses WHERE id = ?",
      id
    );
    return result;
  }
}

module.exports = new CourseService();
