CREATE TABLE IF NOT EXISTS users
(
    user_id            INTEGER primary key autoincrement,
    username           TEXT,
    password           TEXT,
    role               TEXT,
    api_key            TEXT,
    last_login         TEXT,
    practical_course   INTEGER default 0,
    theoretical_course INTEGER default 0,
    score              INTEGER default 0,
    bonus              INTEGER default 0
)