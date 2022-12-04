import React from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { metroCities } from './metroCity';
import { violationTypes } from './Violation';
import { useState } from "react";

var output = ""
var file_uploaded=false
function SubmitObstruction() {

  const [notes, setNotes] = useState('');
  const [city, setCity] = useState('default');
  const [location, setLocation] = useState('');
  const [violation, setViolation] = useState('default');
  const [licensePlate, setLicensePlate] = useState('');
  // var selectedCity = "default", selectedViolation="default";
  const loadFile = function (event) {
    output = document.getElementById('output');
    const fileSize = event.target.files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 5) {
    alert('File size exceeds 5 MiB');
    const file =
                document.getElementById('single');
            file.value = '';
    alert("File too large. File removed from form.")
            
    return;
    // $(file).val(''); //for clearing with Jquery
    }
    output.src = URL.createObjectURL(event.target.files[0]);
    console.log(event.target.files[0])
    console.log(output.src)
    output.onload = function () {
      console.log("working")
      file_uploaded=true
      URL.revokeObjectURL(output.src)
    }
    file_uploaded=true
  }
  var file_incorrect = false
  const uploadImage = async (event) => {
  if (file_uploaded){
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
    removeLoader(); // changed
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
      const crd = pos.coords;
      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      setLocation([crd.longitude, crd.latitude]);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  function submitButtonClick(event) {
    var payload = { "city": city, "violation": violation }

    if (location !== "") {
      payload["lon"] = location[0]
      payload["lat"] = location[1]

    }
    if (notes !== "")
      payload["notes"] = notes

    if (licensePlate !== "")
      payload["license"] = licensePlate

    console.log("Form data", payload)
    if (city !== "default" && violation !== "default") {
      uploadDets(payload)

    } else {
      alert("Please fill all required values (marked with *)")
    }
    // document.getElementById("submit_form").reset();
    setLocation('');
    if (city !== "default") {
      setCity("default");
    }
    if (violation !== "default") {
      setViolation("default");
    }
  
    setNotes('');
    setLicensePlate('');
    
    resetForm()
    // window.location.replace("https://cool-conkies-80a0da.netlify.app/#/liveDb");
    // output = document.getElementById('output');
    // output.src = ""
    // URL.revokeObjectURL(output.src)
    file_uploaded=false
  }

  async function uploadDets(jsonObj) {
    try {
      showLoader();
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
        alert("Form Submited")
        removeLoader();
        resetForm();
      }
     
    }
    catch (error) {
      console.log(error)
    }
  }
  
  function resetForm() {
    document.getElementById('city-selector').selectedIndex = null;
    document.getElementById('output').style.display = 'inline';
    output = document.getElementById('output');
    output.src="";
    const file =
                document.getElementById('single');
            file.value = '';
    // document.getElementById("submit_form").reset();
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

  function showLoader() {
    console.log("loader called");
    document.getElementsByClassName("overlay")[0].classList.remove("hide");
    document.getElementsByClassName("nav")[0].classList.add("hide");
    document.getElementsByClassName("submit-obstruction")[0].classList.add("hide");
  }

  function removeLoader() {
    document.getElementsByClassName("overlay")[0].classList.add("hide");
    document.getElementsByClassName("nav")[0].classList.remove("hide");
    document.getElementsByClassName("submit-obstruction")[0].classList.remove("hide");
  }

    return (
      <>
      <div class="overlay hide">
        <div class="loader"></div>
      </div>
        <div class="submit-obstruction d-flex justify-content-center">
          <form class="form-class form-horizontal" id="submit_form" style={{ marginTop: "60px" }}>
            <div class="form-group">
              <label for="violation-type" class="required control-label" aria-required="true">Category *</label>
              <select class="form-control" value={violation} id="violation-type" onChange={(event) => setViolation(event.target.value)} required>
                <option value="default" disabled selected>Select one category</option>
                {generateViolationOptions()}
              </select>
            </div>
            <div class="form-group">
              <label for="city-selector" class="control-label required" aria-required="true">Metro city *</label>
              <select class="form-control" value={city} id="city-selector" required onChange={(event => setCity(event.target.value))}>
              <option value="default" disabled selected>Select one city</option>
                {generateOptions()}
              </select>
            </div>
            <div class="form-group">
              <label for="geoLocation">Location</label>
              <input type="text" class="form-control" id="geoLocation" value={location} disabled />
              <button type="button" class="btn" onClick={() => getLocation()}>Get Location</button>
              <span className='smallNote'>(The location might take sometime to load)</span>
            </div>
            <div class="form-group">
              <label for="exampleFormControlInput1">License Plate Number</label>
              <input type="email" value={licensePlate} class="form-control" id="license_plate" onChange={(event => setLicensePlate(event.target.value))} placeholder="CD 80519" />
            </div>
            <div class="form-group">
              <label for="exampleFormControlTextarea1">Notes</label>
              <textarea value={notes} class="form-control" id="notes" rows="3" onChange={(event => setNotes(event.target.value))}></textarea>
            </div>
            <div class="form-group input">
              <input
                type="file"
                id="single"
                accept=".png,.jpeg,.jpg"
                onChange={loadFile}
              />
            </div>
            <div class="form-group">
              <img id="output" alt={"Preview"} style={{ height: "200px", width: "200px" }} />
            </div>
            
            <button type="button" class="btn submit" onClick={submitButtonClick}>Submit</button>

          </form>
        </div>
      </>
    )
  
}
  export default SubmitObstruction