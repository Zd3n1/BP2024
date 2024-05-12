CREATE TABLE IF NOT EXISTS courses
(
    course_id integer constraint courses_pk primary key autoincrement,
    title text not null,
    description text
    img         TEXT
);