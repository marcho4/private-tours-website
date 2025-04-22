CREATE TABLE IF NOT EXISTS "events" (
	"id" serial NOT NULL UNIQUE,
	"type" varchar(255) NOT NULL,
	"people_limit" bigint NOT NULL,
	"price" varchar(255) NOT NULL,
	"duration" bigint NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TimeSlots" (
	"id" serial NOT NULL UNIQUE,
	"date" date NOT NULL,
	"time_start" time without time zone NOT NULL,
	"time_end" time without time zone NOT NULL,
	"status" varchar(255) NOT NULL,
	"available_spots" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial NOT NULL UNIQUE,
	"timeslot_id" varchar(255) NOT NULL,
	"tour_id" varchar(255) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_surname" varchar(255) NOT NULL,
	"user_phone_number" varchar(255) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"number_of_people" bigint NOT NULL,
	"additional_info" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);



ALTER TABLE "bookings" ADD CONSTRAINT "bookings_fk1" FOREIGN KEY ("timeslot_id") REFERENCES "TimeSlots"("id");

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_fk2" FOREIGN KEY ("tour_id") REFERENCES "events"("id");