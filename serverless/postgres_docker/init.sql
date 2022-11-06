CREATE EXTENSION postgis;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION address_standardizer_data_us;


CREATE USER cs484 PASSWORD 'postgres';
create database cs484 owner cs484;
use cs484;
