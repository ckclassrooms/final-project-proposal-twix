
--- Main function of maps page >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

CREATE OR REPLACE FUNCTION get_points1(lat1 double precision,lon1 double precision,lat2 double precision, lon2 double precision,cats text[])
  RETURNS TABLE(lat double precision, lon double precision,id integer,violation_type text,ts timestamp, image_url text)
  LANGUAGE sql AS
$func$
SELECT v.lat as lat, v.lon as lon,v.id,v.violation_type,v.ts,v.image_url
FROM   violations v
WHERE  ST_covers(
 ST_TRANSFORM(ST_MakeEnvelope(lat1,lon1,lat2,lon2,  4326),4326),
  st_transform(v.loc::geometry,4326)) and v.violation_type = ANY(cats);
$func$;






-----Insert func
CREATE OR REPLACE FUNCTION insert_into_table("user_number" VARCHAR,
"violation_type" text,
"lat" double precision,
"lon" double precision,
"metro_city" text,
"license_plate" text,
"ts" timestamp,
"image_url" text,
"notes" text)
returns void 
  LANGUAGE sql AS
$func$
INSERT into violations(user_id,violation_type,ts,metro_city,license_plate,notes,loc,lat,lon,image_url) VALUES(
  user_number,violation_type,ts,metro_city,license_plate,notes,ST_SetSRID(ST_MakePoint(lon,lat),4326),lat,lon,image_url)
$func$;



select * from insert_into_table(1,'TAXI',22.02,22.02,'bangalore','sdds3','2022-11-23T21:30:21.754Z','adsadf','notes');




--------- >>>>>>>>>>>>>>>>>>>> Polygon function
CREATE OR REPLACE FUNCTION polygon_map("locs" text,cats text[])
returns TABLE(lat double precision, lon double precision,id integer,violation_type text,ts timestamp, image_url text) 
  LANGUAGE sql AS
$func$
SELECT v.lat as lat, v.lon as lon,v.id,v.violation_type,v.ts,v.image_url
FROM   violations v
WHERE  ST_covers(
 ST_Polygon(ST_GeomFromText(locs),4326),
  st_transform(v.loc::geometry,4326)) and v.violation_type = ANY(cats);
$func$;



-- ><>>>>>>>>>>>>>>>>>>>>>>>>>> Grid function


CREATE OR REPLACE FUNCTION grid_func_stored("cats" text[],"cities" text[],"ts1" timestamp,"ts2" timestamp)
returns TABLE(lat double precision, lon double precision,violation_type varchar(100),ts TIMESTAMP,
  metro_city VARCHAR(100),
  license_plate VARCHAR(100),
  image_url VARCHAR(500),notes varchar(100)) 
  AS
$$
DECLARE 
condition_string1 VARCHAR ;
BEGIN
condition_string1 := 'v.user_id is not null';
IF array_length(cats, 1) > 0 then
    condition_string1 := condition_string1 || ' and v.violation_type = Any($1)';
end if;
IF array_length(cities, 1) > 0 then
    condition_string1 := condition_string1 || ' and v.metro_city = Any($2)';
end if;

if ts1 is not null and ts2 is not null and ts1<ts2 then
  condition_string1 := condition_string1 || ' and v.ts between ' || quote_literal(ts1) || ' and '|| quote_literal(ts2);
end IF;

 return query execute format('
SELECT v.lat as lat, v.lon as lon,v.violation_type,v.ts,v.metro_city,v.license_plate,v.image_url,v.notes
FROM   violations v
WHERE %s order by v.ts desc;':: text , condition_string1) using cats,cities;
end;
$$ language plpgsql ;