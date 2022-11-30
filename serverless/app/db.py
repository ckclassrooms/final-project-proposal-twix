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
conn = psycopg2.connect(
        host="db.kesgogujwpshhhahoouk.supabase.co",
        port=5432,
        database="postgres",
        user="postgres",
        password="u5jA!Wxr324@mWu")

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
user_ids = ["1","2","3","4"]
image_urls = ['https://dl.airtable.com/.attachmentThumbnails/f9540c659b6c59abdaba8daee2e85ec5/e9f2dec5',
                'https://dl.airtable.com/.attachmentThumbnails/dfa2c32d7c63ce832dc87921b0096cb8/ac2afcb9',
               'https://dl.airtable.com/.attachmentThumbnails/279117eeb93bce6a27ae7b7e22382bef/80f3ea82',
               'https://dl.airtable.com/.attachmentThumbnails/f54fde46d840f571d43d3e7419e4b755/89d230ce',
                'https://dl.airtable.com/.attachmentThumbnails/2b22520c38d8003fc6ea8d296255098f/c9f0dd9d',
                'https://dl.airtable.com/.attachmentThumbnails/57fcecce4515c4e466330a23293ffae9/7d255989']

def fill_db():
        cur = conn.cursor()
        start_timestamp = datetime.now().timestamp()
        metro_city='chicago'
        center_lon= 41.864586
        center_lat= -87.794463
        for i in range(100):
                time.sleep(1)
                lat = center_lat + random.uniform(-0.001, 0.1)
                lon = center_lon + random.uniform(-0.001, 0.1)
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