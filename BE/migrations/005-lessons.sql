CREATE TABLE IF NOT EXISTS lessons
(
    lesson_id integer constraint lessons_pk primary key autoincrement,
    course_id integer constraint lessons_courses_id_fk references courses,
    title     text not null,
    text      text not null
);