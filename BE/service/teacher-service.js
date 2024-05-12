const { database } = require("../database/database");

class TeacherService {
  async getAll() {
    const teachers = await database().all("SELECT * FROM users");
    return teachers;
  }

  // async create(course) {
  //   const result = await database().run(
  //     "INSERT INTO  courses (title, description, id) VALUES (?, ?, ?)",
  //     course.title,
  //     course.description,
  //     course.id
  //   );
  //   return await this.getById(result.lastID);
  // }


}

module.exports = new TeacherService();
