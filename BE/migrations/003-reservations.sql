CREATE TABLE IF NOT EXISTS reservations
(
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT,
    duration INTEGER,
    description TEXT,
    user_id INTEGER NOT NULL,
    CONSTRAINT c1
        FOREIGN KEY(user_id) REFERENCES users(user_id)
)