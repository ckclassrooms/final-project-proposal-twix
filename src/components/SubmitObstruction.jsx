import React from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { metroCities } from './metroCity';
import { violationTypes } from './Violation';

var output = ""
var file_uploaded=false
function SubmitObstruction() {
  console.log("submit obstruction")
  const loadFile = function (event) {
    output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      file_uploaded=true
      URL.revokeObjectURL(output.src)
    }
  }
  var file_incorrect = false
  const uploadImage = async (event) => {
if(file_uploaded){
  try {
    var allowedExtension = ['jpeg', 'jpg', 'png'];
    const file = document.getElementById('single').files[0]
    const fileExt = file.name.split('.').pop().toLowerCase();
    var isValidFile = false;
    // console.log(fileExt)
    const fileName = `${uuidv4().toString().replace(/-/g, "")}.${fileExt}`
    const filePath1 = `public/violations/${fileName}`
    console.log(`File ${filePath1}`)
    let { error: uploadError } = await supabase.storage.from('bike-lane-1').upload(filePath1, file)

    if (uploadError) {
      console.log("Unable to upload ", uploadError)
      throw uploadError
    }
    for (var index in allowedExtension) {

      if (fileExt === allowedExtension[index]) {
        isValidFile = true;
        break;
      }
    }
    if (!isValidFile) {

      file_incorrect = true
      alert('Allowed Extensions are : *.' + allowedExtension.join(', *.'))
      throw Error("allowed extension");
    }
    else {
      console.log("Upload complete")
      const { data } = supabase
        .storage
        .from('bike-lane-1')
        .getPublicUrl(filePath1)
      console.log("image uploaded url = ", data)
      return data["publicUrl"]
    }
  }
  catch (error) {

    console.log("Upload error", error)
    console.log(error)
    alert("Image upload failed")
    throw error
  } finally {
    console.log("Upload complete")
  }
}
    
  }
  function getLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      // eslint-disable-next-line
      const crd = pos.coords;
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      document.getElementById("geoLocation").value = `${crd.longitude}, ${crd.latitude}`;
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  function submitButtonClick(event) {
    var city_selector = document.getElementById("city-selector");
    var city = city_selector.options[city_selector.selectedIndex].text;
    var violation_selector = document.getElementById("violation-type");
    var violation = violation_selector.options[violation_selector.selectedIndex].text;

    var loc_text = document.getElementById("geoLocation");
    var loc = loc_text.value;

    var license_text = document.getElementById("license_plate");
    var license = license_text.value;

    var notes_text = document.getElementById("notes");
    var notes = notes_text.value;
    var payload = { "city": city, "violation": violation }

    if (loc !== "") {
      payload["lon"] = loc.split(",")[0]
      payload["lat"] = loc.split(",")[1]

    }
    if (notes !== "")
      payload["notes"] = notes

    if (license !== "")
      payload["license"] = license

    console.log("Form data", payload)
    if (city !== "Select One" && violation !== "Select One") {
      uploadDets(payload)

    } else {
      alert("Please fill all required values (marked with *)")
    }
    document.getElementById("submit_form").reset();
    // document.getElementById('output').style.display = 'none';
    // document.getElementById('output').reset();
    // document.getElementById("submit_form").reset();
    // window.location.replace("https://cool-conkies-80a0da.netlify.app/#/liveDb");
    output = document.getElementById('output');
    output.src = ""
    URL.revokeObjectURL(output.src)
    file_uploaded=false
  }

  async function uploadDets(jsonObj) {
    try {
      console.log("jsonArray");
      console.log(jsonObj);
      console.log("Uploading image")
      
      const imagePath = await uploadImage()
      console.log("upload complete with imagepath = ", imagePath)
      console.log("Making db call")
      if (file_incorrect !== true) {
        const { data, error } = await supabase.functions.invoke('submit_violation_2', {
          body: JSON.stringify({
            "lat": jsonObj["lat"],
            "lon": jsonObj["lon"],
            "license_plate": jsonObj["license"],
            "metro_city": jsonObj["city"],
            "violation_type": jsonObj["violation"],
            "image_url": imagePath
          })
        })
        if (error) {
          console.log(error);
        }
        console.log("data:");
        console.log(data);
        console.log("Update the UI to reflect status")
      }
      if (file_incorrect !== true) {
        alert("Form Submited")
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  
  function generateOptions() {
    const values = [];
    metroCities.forEach(city => { values.push(<option>{city}</option>) })
    return values;
  }

  function generateViolationOptions() {
    const values = [];
    violationTypes.forEach(city => { values.push(<option>{city}</option>) })
    return values;
  }
    return (
      <>
        <div class="d-flex justify-content-center">
          <form class="form-class" id="submit_form" style={{ marginTop: "60px" }}>
            <div class="form-group">
              <label for="violation-type" class="required" aria-required="true">Category *</label>
              <select class="form-control" id="violation-type" required>
                <option value="" selected="">Select one category</option>
                {generateViolationOptions()}
              </select>
            </div>
            <div class="form-group">
              <label for="city-selector" class="required" aria-required="true">Metro city *</label>
              <select class="form-control" id="city-selector" required>
                {generateOptions()}
              </select>
            </div>
            <div class="form-group">
              <label for="geoLocation">Location</label>
              <input type="text" class="form-control" id="geoLocation" value="" disabled />
              <button type="button" class="btn btn-primary" onClick={() => getLocation()}>Get Location</button>
              <span className='smallNote'>(The location might take sometime to load)</span>
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">License Plate Number</label>
              <input type="email" class="form-control" id="license_plate" placeholder="CD 80519" />
            </div>
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Notes</label>
              <textarea class="form-control" id="notes" rows="3"></textarea>
            </div>
            <div class="form-group">
              <input
                type="file"
                id="single"
                accept="image/*"
                onChange={loadFile}
              />
            </div>
            <div class="form-group">
              <img id="output" alt={"Preview"} style={{ height: "200px", width: "200px" }} />
            </div>
            
            <button type="button" class="btn btn-primary" onClick={submitButtonClick}>Submit</button>

          </form>
        </div>
      </>
    )
  
}
  export default SubmitObstruction