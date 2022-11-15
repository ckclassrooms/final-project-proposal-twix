import os
import psycopg2
from datetime import datetime, timezone
import uuid
import time

import random
conn = psycopg2.connect(
        host="localhost",
        port=54322,
        database="postgres",
        user="postgres",
        password="postgres")

def dummy_op():
# Open a cursor to perform database operations
        cur = conn.cursor()
        print("connection successful",conn)
        # Execute a command: this creates a new table
        


        conn.commit()

        cur.close()
        conn.close()

def fill_users():
        cur = conn.cursor()
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES(a,null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES(a,null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES(a,null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES(a,null)""")
        conn.commit()
        cur.close()

def insert_into_tables(violation,cur):
        
        
        violation_table_stmt = """INSERT INTO violations(user_id,violation_type,ts,metro_city,license_plate,notes,loc) VALUES(%(user_id)s,%(violation_type)s,%(ts)s,%(metro_city)s,%(license_plate)s,%(notes)s,ST_SetSRID(ST_MakePoint(%(lat)s, %(lon)s), 4326));"""
        violation_values = {
                "user_id":violation["user_id"],
                "violation_type":violation["violation_type"],
                "ts": violation["time_stamp"],
                "metro_city": violation["metro_city"],
                "license_plate":violation["license_plate"],
                "notes":violation["notes"],
                "lat":violation["lat"],
                "lon":violation["lon"]
        }
        cur.execute(violation_table_stmt,violation_values)

violation_types = ['CONSTRUCTION_VEHICLE','COMPANY','MUNICIPAL_VEHICLE','PRIVATE_VEHICLE','TAXI','OTHER']
license_plates = ['adn23','23ewfsd','343sf','353r4f','w43trfw3','','32rwed','23454rre']
user_ids = [1,2,3,4]

def fill_db():
        cur = conn.cursor()
        start_timestamp = datetime.now().timestamp()
        metro_city='chicago'
        center_lon= 41.869507
        center_lat= -87.653015
        for i in range(100):
                time.sleep(1)
                lat = center_lat + random.uniform(-0.001, 0.01)
                lon = center_lon + random.uniform(-0.001, 0.01)
                ts= dt = datetime.now(timezone.utc)
                violation  = {
                        "user_id":str(random.choice(user_ids)),
                        "violation_type":random.choice(violation_types),
                        "time_stamp":ts,
                        "metro_city":metro_city,
                        "license_plate":random.choice(license_plates),
                        "notes":"dummy_notes",
                        "lat":lat,
                        "lon":lon
                }
                insert_into_tables(violation,cur)
        conn.commit()
        cur.close()
        conn.close()

# dummy_op()
# fill_users
fill_db()