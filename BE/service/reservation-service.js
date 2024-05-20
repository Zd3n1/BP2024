const { database } = require('../database/database');

class ReservationService {
  async getAll() {
    const reservations = await database().all("SELECT * FROM reservations");
    return reservations;
  }

  async create(reservation) {
    const result = await database().run(
        // zmenit?
        "INSERT INTO  reservations (time, duration, description, user_id) VALUES (?, ?, ?, ?)",
        reservation.time,
        reservation.duration,
        reservation.description,
        reservation.user_id,
    );
    return await this.getById(result.lastID);
  }

  async getById(id) {
    const result = await database().get(
        "SELECT * FROM reservations WHERE reservation_id = ?",
        id
    );
    return result;
  }

  async delete(id) {
    try {
      const result = await database().run(
          "DELETE FROM reservations WHERE reservation_id = ?",
          id
      );
      return result.changes > 0;
    } catch (error) {
      console.error("Failed to delete reservation:", error);
      throw error;
    }
  }

  async deletedUser(id) {
    try {
      const result = await database().run(
          "DELETE FROM reservations WHERE user_id = ?",
          id
      );
      return result.changes > 0;
    } catch (error) {
      console.error("Failed to delete users reservations:", error);
      throw error;
    }
  }

  // async getUsername(user_id) {
  //   const result = await db.get("SELECT username FROM users WHERE user_id = ?", [user_id]);
  //   return result ? result.username : null;
  // }

  async getUsername(user_id) {
    const db = database();
    try {
      const result = await db.get("SELECT username FROM users WHERE user_id = ?", [user_id]);
      return result ? result.username : null;
    } catch (error) {
      console.error("Database error in getUsername:", error);
      throw error;
    }
  }

  async getRole(user_id) {
    const db = database();
    try {
      const result = await db.get("SELECT role FROM users WHERE user_id = ?", [user_id]);
      return result ? result.role : null;
    } catch (error) {
      console.error("Database error in getRole:", error);
      throw error;
    }
  }
}



module.exports = new ReservationService();