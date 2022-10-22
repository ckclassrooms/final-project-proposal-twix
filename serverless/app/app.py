from flask import Flask, jsonify, request,json
import html
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
    return {"data":jsonOut}
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)