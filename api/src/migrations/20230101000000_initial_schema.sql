CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tours (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    min_persons INT NOT NULL,
    max_persons INT NOT NULL,
    duration INTERVAL NOT NULL,
    meeting_place TEXT NOT NULL,
    is_outdoor BOOLEAN NOT NULL,
    is_for_kids BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS timeslots (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    day DATE NOT NULL,
    time_from TIME NOT NULL,
    time_to TIME NOT NULL,
    reserved BOOLEAN NOT NULL DEFAULT false,
    excursion_id uuid NULL,
    CONSTRAINT fk_excursion FOREIGN KEY (excursion_id)
     REFERENCES tours(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    persons SMALLINT NOT NULL,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(40) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(60) NOT NULL,
    additional_info TEXT,
    excursion_id uuid NOT NULL,
    timeslot_id uuid NOT NULL,
    CONSTRAINT fk_timeslot FOREIGN KEY (timeslot_id)
        REFERENCES timeslots(id),
    CONSTRAINT fk_excursion_id FOREIGN KEY (excursion_id)
        REFERENCES tours(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    review TEXT NOT NULL,
    written_by VARCHAR(50) NOT NULL,
    rating float NOT NULL,
    excursion_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    CONSTRAINT fk_excursion_id FOREIGN KEY (excursion_id)
       REFERENCES tours(id),
    CONSTRAINT fk_booking_id FOREIGN KEY (booking_id)
       REFERENCES bookings(id)
); 