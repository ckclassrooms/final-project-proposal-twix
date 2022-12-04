CREATE EXTENSION postgis;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION address_standardizer_data_us;

CREATE TABLE violations1 (
  id              SERIAL PRIMARY KEY,
  user_id           uuid,
  violation_type    VARCHAR(100) NULL,
  ts                TIMESTAMP NOT NULL,
  metro_city        VARCHAR(100) NULL,
  license_plate     VARCHAR(100) NULL,
  notes             VARCHAR(100) ,
  loc geography(POINT,4326) NULL,
  lat double precision NULL,
  lon double precision NULL,
  image_url VARCHAR(500) NULL

);


