import os
import psycopg2

conn = psycopg2.connect(
        host="localhost",
        database="cs484",
        user="cs484",
        password="jonbhai")

# Open a cursor to perform database operations
cur = conn.cursor()
print("connection successful",conn)
# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS books;')


conn.commit()

cur.close()
conn.close()