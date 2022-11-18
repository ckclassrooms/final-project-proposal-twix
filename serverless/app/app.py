from flask import Flask, jsonify, request,json
import html
import psycopg2
import requests
import json
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello, World!"



'''
Method to accept data about violation
The data is extracted from form data, hence client should make a submit a form to this endpoint.
Data extracted: 
    username: string
    timestamp: Unix time stamp
    images: multiple images with keys being [image1, image2,image3 ....]
    location: {lat:,lon:}
    metrocity: string
    license plate: string
    notes: string
    type of violation: string (client handles this as enum)
'''
#postgres docker: cs484:jonbhai


def grid():
    url = "https://kesgogujwpshhhahoouk.functions.supabase.co/grid_func_1"

    payload = json.dumps({
    "violation_type": [
        "TAXI",
        "COMPANY"
    ],
    "ts1": "2022-11-16T00:56:00",
    "ts2": "2022-11-16T01:56:00",
    "metro_city": [
        "chicago"
    ]
    })
    headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlc2dvZ3Vqd3BzaGhoYWhvb3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcxNjY4NTksImV4cCI6MTk4Mjc0Mjg1OX0.vLaXeTLbdnc7MyhoA9Qe9v_gp3w0r_GP-XR80AFu6oc',
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)

@app.route("/submit", methods=['POST'])
def accept_data_from_client():
    # todo deal with auth

    print(len(request.files))
    print(request.form)
    form_data = request.form
    jsonOut = {}
    for each in form_data.keys():
        jsonOut[each]=html.escape(form_data[each])
    # output = html.escape("form_data:"+form_data)
    print(form_data['username'])
    grid()
    return {"data":jsonOut}
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)