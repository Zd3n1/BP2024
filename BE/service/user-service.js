const { database } = require("../database/database");
const { passwordConfig, jwtConfig } = require("../config");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

class UserService {
  async getByUsername(username) {
    return await database().get(
      "SELECT * FROM users WHERE username = ?",
      username
    );
  }

  async getAll1() {
    const users = await database().all("SELECT * FROM users ORDER BY score DESC");    //where score desc
    return users;
  }

  // async getAll() {
  //   const teachers = await database().all("SELECT * FROM users");
  //   return teachers;
  // }

  generateToken(user) {
    const tokenPayload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      theoretical_course: user.theoretical_course,
    };
    return jwt.sign(tokenPayload, jwtConfig.secret, {
      algorithm: jwtConfig.algorithms[0],
    });
  }

  hashPassword(password) {
    return crypto
      .pbkdf2Sync(
        password,
        passwordConfig.salt,
        passwordConfig.iterations,
        passwordConfig.keylen,
        passwordConfig.digest
      )
      .toString(`hex`);
  }

  // // storedHash = user.password;
  //
  // comparePassword(inputPassword, storedHash) {
  //   const inputHash = this.hashPassword(inputPassword);
  //   return inputHash === storedHash;
  // }


  async getUsername(user_id) {
    try {
      const result = await database().get("SELECT username FROM users WHERE user_id = ?", [user_id]);
      return result ? result.username : null;
    } catch (error) {
      console.error("Database error in getUsername:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await database().run(
          "DELETE FROM users WHERE user_id = ?",
          id
      );
      return result.changes > 0;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }

  async create(user) {
    const result = await database().run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        user.username,
        this.hashPassword(user.password),
        user.role,
    );
    return await this.getAll1();
  }


  async AddScore(user_id, score) {
    try {
      const result = await database().run("UPDATE users SET score = score + ? WHERE user_id = ?", [score, user_id]);
      return result;
    } catch (e) {
      console.error("Database error in AddScore:", e);
      throw e;
    }
  }

  async theoretical(user_id) {
    try {
      const result = await database().run("UPDATE users SET theoretical_course = users.theoretical_course + 1 WHERE user_id = ?", [user_id]);
      return result;
    } catch (e) {
      console.error("Database error in theoretical:", e);
      throw e;
    }
  }

  async AddBonus(user_id, bonus) {
    try {
      const result = await database().run("UPDATE users SET bonus = bonus + ? WHERE user_id = ?", [bonus, user_id]);
      return result;
    } catch (e) {
      console.error("Database error in AddBonus:", e);
      throw e;
    }
  }
}

module.exports = new UserService();
