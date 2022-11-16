CREATE EXTENSION postgis;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION address_standardizer_data_us;

CREATE TABLE users (
    id  SERIAL PRIMARY KEY,
    user_name         VARCHAR(100) NOT NULL,
    profile_pic_url  VARCHAR(100) NULL
);

CREATE TABLE violations (
  id              SERIAL PRIMARY KEY,
  user_id           INT,
  violation_type    VARCHAR(100) NULL,
  ts                TIMESTAMP NOT NULL,
  metro_city        VARCHAR(100) NULL,
  license_plate     VARCHAR(100) NULL,
  notes             VARCHAR(100) ,
  loc geography(POINT,4326) NULL,
  lat double precision NULL,
  lon double precision NULL,
  image_url VARCHAR(500) NULL,
  CONSTRAINT fk_user_violations FOREIGN KEY(user_id) REFERENCES users(id)

);


