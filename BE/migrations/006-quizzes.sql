CREATE TABLE IF NOT EXISTS quezzis
(
    quezze_id integer constraint quezzis_pk primary key autoincrement,
    lessons_id integer constraint quezzis_lessons_id_fk references lessons,
    question   text not null,
    options    text not null,
    correct    integer
);