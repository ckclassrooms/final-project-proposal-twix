import os
import psycopg2
from datetime import datetime, timezone
import uuid
import time

import random
'''
conn = psycopg2.connect(
        host="localhost",
        port=54322,
        database="postgres",
        user="postgres",
        password="postgres")
'''


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
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES('a1',null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES('a2',null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES('a3',null)""")
        cur.execute("""INSERT INTO USERS(user_name,profile_pic_url) VALUES('a4',null)""")
        conn.commit()
        cur.close()

def insert_into_tables(violation,cur):
        
        
        violation_table_stmt = """INSERT INTO violations(user_id,violation_type,ts,metro_city,license_plate,notes,loc,lat,lon,image_url) VALUES(%(user_id)s,%(violation_type)s,%(ts)s,%(metro_city)s,%(license_plate)s,%(notes)s,ST_SetSRID(ST_MakePoint(%(lat)s, %(lon)s), 4326),%(lat)s,%(lon)s,%(image_url)s);"""
        violation_values = {
                "user_id":violation["user_id"],
                "violation_type":violation["violation_type"],
                "ts": violation["time_stamp"],
                "metro_city": violation["metro_city"],
                "license_plate":violation["license_plate"],
                "notes":violation["notes"],
                "lat":violation["lat"],
                "lon":violation["lon"],
                "image_url":violation["image_url"]
        }
        cur.execute(violation_table_stmt,violation_values)

violation_types = ['CONSTRUCTION_VEHICLE','COMPANY','MUNICIPAL_VEHICLE','PRIVATE_VEHICLE','TAXI','OTHER']
license_plates = ['adn23','23ewfsd','343sf','353r4f','w43trfw3','','32rwed','23454rre']
user_ids = [1,2,3,4]
image_urls = ['https://images.unsplash.com/photo-1668177706281-3c7f9e0153df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80',
                'https://images.unsplash.com/photo-1668525834119-bd0860fa8e0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
               'https://images.unsplash.com/photo-1668525330295-e75a2ccd962f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80',
               'https://images.unsplash.com/photo-1668455520578-0847836e48ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80',
                'https://images.unsplash.com/photo-1668521524306-78ee6f433560?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
                'https://images.unsplash.com/photo-1668369313540-6a409df097db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80']

def fill_db():
        cur = conn.cursor()
        start_timestamp = datetime.now().timestamp()
        metro_city='chicago'
        center_lon= 41.869507
        center_lat= -87.653015
        for i in range(500):
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
                        "lon":lon,
                        'image_url':random.choice(image_urls)
                }
                insert_into_tables(violation,cur)
        conn.commit()
        cur.close()
        conn.close()

# dummy_op()
# fill_users()
fill_db()