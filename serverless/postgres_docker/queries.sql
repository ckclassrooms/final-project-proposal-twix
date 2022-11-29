SELECT loc 
FROM violations 
WHERE ST_Covers(ST_Buffer(
 ST_GeogFromText('POINT(41.869507 -87.653015)'),
 5, 'quad_segs=8'), violations.loc);


SELECT ST_Buffer(
 ST_GeogFromText('POINT(41.869507 -87.653015)'),
 5, 'quad_segs=8');


SELECT ST_X(loc::geometry) as lat, ST_Y(loc::geometry)as lon
FROM violations 
WHERE ST_Covers(ST_Buffer(
 ST_GeogFromText('POINT( -87.653015 41.869507)'),
 5, 'quad_segs=8'), violations.loc);
 


SELECT ST_X(loc::geometry) as lat, ST_Y(loc::geometry)as lon,loc
FROM violations 
WHERE ST_covers(
 ST_TRANSFORM(ST_MakePolygon(ST_GeomFromText('SRID=4326;LINESTRING(
    -87.647589 41.869612, 
    -87.642740  41.869950,
    -87.642666  41.865633, 
    -87.648841 41.865296, 
    -87.647589 41.869612)')),4326),
  st_transform(violations.loc::geometry,4326));



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
CREATE OR REPLACE FUNCTION insert_into_table("user_number" integer,
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




--------- >>>>>>>>>>>>>>>>>>>>
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






CREATE OR REPLACE FUNCTION poly_test("locs" text)
returns geometry
  LANGUAGE sql AS
$func$
SELECT 
 ST_Polygon(ST_GeomFromText(locs),4326);
$func$;


select * from poly_test('SRID=4326;LINESTRING(-87.651769 41.880070,-87.647589 41.869612,-87.651769 41.780070,-87.651769 41.880070)')


select * from polygon_map('SRID=4326;LINESTRING(-87.651769 41.880070,-87.647589 41.869612,-87.651769 41.780070,-87.651769 41.880070)',['TAXI'])


select * from get_points1(-87.651769,
     41.880070,
    -87.647589,
    41.869612,array['TAXI'])