import React from 'react';
// import {useState} from 'react';
// import Avatar from '../components/Avatar';
import {supabase} from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
// import { Button } from 'bootstrap';
function SubmitObstruction() {
  const file = ""
    // const [file, setFile] = useState();
    // function handleChange(e) {
    //     console.log(e.target.files);
    //     setFile(URL.createObjectURL(e.target.files[0]));
    // }
    const uploadImage = async (event) => {
        try {
          //setUploading(true)
    
        //   if (!event.target.files || event.target.files.length === 0) {
        //     throw new Error('You must select an image to upload.')
        //   }
    
          const file = document.getElementById('single').files[0]
          const fileExt = file.name.split('.').pop()
          const fileName = `${uuidv4().toString().replace(/-/g,"")}.${fileExt}`
          const filePath1 = `public/violations/${fileName}`
          console.log(`File ${filePath1}`)


          let {  error: uploadError } = await supabase.storage.from('bike-lane-1').upload(filePath1, file)
    
          if (uploadError) {
            console.log("Unable to upload ",uploadError)
            throw uploadError
          }

          console.log("Upload complete")
          const { data } = supabase
                          .storage
                          .from('bike-lane-1')
                          .getPublicUrl(filePath1)
          //onUpload(filePath)
          return data["publicUrl"]
        } catch (error) {
          console.log("Upload error",error)
        } finally {
           console.log("Upload complete")
          //setUploading(false)
        }
        
      }
      function getLocation()
      {
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

    function submitButtonClick(event){
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
      var payload = {"city":city,"violation":violation}

      if(loc!==""){
        payload["lon"]=loc.split(",")[0]
        payload["lat"]=loc.split(",")[1]

      }
        

      if(notes!=="")
        payload["notes"]=notes

      if(license!=="")
        payload["license"]=license

      console.log("Form data",payload)
      uploadDets(payload)
    }

      async function uploadDets(jsonObj) {
        console.log("jsonArray");
        console.log(jsonObj);
        console.log("Uploading image")
        const imagePath = await uploadImage()
        console.log("upload complete with imagepath = ",imagePath)
        console.log("Making db call")
        const { data, error } = await supabase.functions.invoke('submit_violation_2', {
            body:  JSON.stringify({
            "lat":jsonObj["lat"],
            "lon":jsonObj["lat"],
            "license_plate":jsonObj["license"],
            "metro_city":jsonObj["city"],
            "violation_type":jsonObj["violation"],
          "image_url":imagePath})
          })
          if (error) {
            console.log(error);
          }
          console.log("data:");
          console.log(data);
          console.log("Update the UI to reflect status")
    }
    
    return (
        <>
        <div class="d-flex justify-content-center">
        <form class="form-class" id="submit_form">
            {/* <div class="form-group">
                <label for="exampleFormControlInput1">Username</label>
                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="username"/>
            </div> */}
            <div class="form-group">
                <label for="violation-type">Category</label>
                <select class="form-control" id="violation-type" required>
                <option>Construction</option>
                <option>Company Vehicle</option>
                <option>Municipal Vehicle - including USPS</option>
                <option>Private Owner Vehicle</option>
                <option>Taxi / Uber / Lyft</option>
                <option>Other  (damaged lane, snow, debris, pedestrian, etc.)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="city-selector">Metro city</label>
                <select class="form-control" id="city-selector" required>
                <option value="" disabled="" class="Vx877 _3pa83">Select metro city</option><option value="recgZhmuvwXbRU1o8" class="Vx877" aria-selected="false">My metro city is not listed</option><option value="rec80VroenY8u41ju" class="Vx877" aria-selected="false">Albuquerque - NM</option><option value="rec5ZRCZFHIJz6Xz2" class="Vx877" aria-selected="false">Alexandria - VA</option><option value="recnEcSwrCa2j131f" class="Vx877" aria-selected="false">Anchorage - AK</option><option value="recP6tOTejaJ5bV5f" class="Vx877" aria-selected="false">Ann Arbor - MI</option><option value="recnXUlkmSehgE8N7" class="Vx877" aria-selected="false">Arlington - VA</option><option value="recG7DjXykTDKaytt" class="Vx877" aria-selected="false">Athens - GA</option><option value="reccu4FDEqi9cVbRi" class="Vx877" aria-selected="false">Atlanta - GA</option><option value="recURjK3lxhRzGivj" class="Vx877" aria-selected="false">Austin - TX</option><option value="recINZ1yAteNs9kxe" class="Vx877" aria-selected="false">Baltimore - MD</option><option value="recS9uR5H10AWPc1p" class="Vx877" aria-selected="false">Beaverton - OR</option><option value="recgnUlZ3tPDACkEH" class="Vx877" aria-selected="false">Bellevue - WA</option><option value="rec5Y8OfkVKTFQEaP" class="Vx877" aria-selected="false">Bethesda - MD</option><option value="recFnyCEjv9rDsXJW" class="Vx877" aria-selected="false">Bethlehem - PA</option><option value="recbS0eJ81v1WTliM" class="Vx877" aria-selected="false">Boise - ID</option><option value="recDphnWMyfF9LtSh" class="Vx877" aria-selected="false">Boston - MA</option><option value="recYgxI7HP590qIJ6" class="Vx877" aria-selected="false">Boulder - CO</option><option value="recdZfzW8befEiTcg" class="Vx877" aria-selected="false">Bristol - UK</option><option value="recJc2FesvTOyDFlU" class="Vx877" aria-selected="false">Brookline - MA</option><option value="reccRHw8ciZNValbi" class="Vx877" aria-selected="false">Buffalo - NY</option><option value="reccLXLUgV9Dd4qhD" class="Vx877" aria-selected="false">Burlington - VT</option><option value="recuaua8zSZp6HCR6" class="Vx877" aria-selected="false">Calgary - AB - Canada</option><option value="recAQhOF7JRWPTtFY" class="Vx877" aria-selected="false">Cambridge - MA</option><option value="rec5aROOUg4WB66cs" class="Vx877" aria-selected="false">Chattanooga - TN</option><option value="rec4jCMz1EdtUkCfT" class="Vx877" aria-selected="false">Chicago - IL</option><option value="rec7QNbCh8BROnmzD" class="Vx877" aria-selected="false">Cincinnati - OH</option><option value="recNKuCrMBwbXFLAK" class="Vx877" aria-selected="false">Cleveland - OH</option><option value="rec82e62GMjFBuhsg" class="Vx877" aria-selected="false">Colorado Springs - CO</option><option value="recTKVbaqGdjqeQN8" class="Vx877" aria-selected="false">Columbia - MO</option><option value="rec2yinpcOyGsIzgJ" class="Vx877" aria-selected="false">Columbus - OH</option><option value="recTTATMvMPYBPvaW" class="Vx877" aria-selected="false">Corvallis - OR</option><option value="recEh2Fa03Qi3aJzJ" class="Vx877" aria-selected="false">Dallas - TX</option><option value="rec4z2xyoZtoTyMWO" class="Vx877" aria-selected="false">Dayton - OH</option><option value="recwzxnbPr9uKIxwP" class="Vx877" aria-selected="false">Denver - CO</option><option value="recefGIIyB2j8ZsSA" class="Vx877" aria-selected="false">Des Moines - IA</option><option value="recWquxg2xHhHAZH4" class="Vx877" aria-selected="false">Detroit - MI</option><option value="rectQS8dFJeQlB4zm" class="Vx877" aria-selected="false">Durham - NC</option><option value="rec4lH3xz1Q0ubyI6" class="Vx877" aria-selected="false">El Paso - TX</option><option value="recbRwn7JHFP2pIK3" class="Vx877" aria-selected="false">Eugene - OR</option><option value="recSQVYMHk9fXdc1T" class="Vx877" aria-selected="false">Evanston - IL</option><option value="rec8NtTGYvFxN0ORn" class="Vx877" aria-selected="false">Everett - WA</option><option value="recEe7gKi76ijcASm" class="Vx877" aria-selected="false">Fitchburg - WI</option><option value="recNmGbg3yXV9dHz6" class="Vx877" aria-selected="false">Fort Collins - CO</option><option value="recAxUiMCvwiI608Y" class="Vx877" aria-selected="false">Fort Lauderdale - FL</option><option value="recc3rdOmjXzzlOlt" class="Vx877" aria-selected="false">Fremont - CA</option><option value="recK1sptm9umgvKRN" class="Vx877" aria-selected="false">Gainesville - FL</option><option value="rec8JdbPZM8EI5JKf" class="Vx877" aria-selected="false">Gold Coast - Queensland Australia</option><option value="rec2R9ppFPPnzrTcP" class="Vx877" aria-selected="false">Grand Rapids - MI</option><option value="recPgwrHpHf3B2sdK" class="Vx877" aria-selected="false">Green Bay - WI</option><option value="recSKwjXgKJexkP4l" class="Vx877" aria-selected="false">Hamilton - ON - CANADA</option><option value="recosRAXe23bO1Lrj" class="Vx877" aria-selected="false">Hartford - CT</option><option value="recclVdC01hSISEsG" class="Vx877" aria-selected="false">Hillsboro - OR</option><option value="recCYipgpEjq3pTm2" class="Vx877" aria-selected="false">Holland - MI</option><option value="recrPVHTJkDg12qir" class="Vx877" aria-selected="false">Honolulu - HI</option><option value="recO86rVxLjzlLhcT" class="Vx877" aria-selected="false">Houston - TX</option><option value="recsqDMUrgHUJt4UP" class="Vx877" aria-selected="false">Huntington Beach - CA</option><option value="rec4r5jsFFaKeUv1u" class="Vx877" aria-selected="false">Indianapolis - IN</option><option value="recwYFlEaDjgUJdGJ" class="Vx877" aria-selected="false">Ithaca - NY</option><option value="recR5aFGSVX0jeU0B" class="Vx877" aria-selected="false">Jacksonville - FL</option><option value="recCScTptBSYZmOr7" class="Vx877" aria-selected="false">Jersey City - NJ</option><option value="rec6P7GL5d6RKpL5I" class="Vx877" aria-selected="false">Kalamazoo - MI</option><option value="recUb5xUsppJGXHzH" class="Vx877" aria-selected="false">Kansas City - KS</option><option value="rec5IsAHHJA9tvT8L" class="Vx877" aria-selected="false">Kansas City - MO</option><option value="recarxLYYNQLzUWQk" class="Vx877" aria-selected="false">Kirkland - WA</option><option value="recH7sRLkCjEkLHFn" class="Vx877" aria-selected="false">Knoxville - TN</option><option value="recMvlIKWSQQGicLI" class="Vx877" aria-selected="false">Lansing - MI</option><option value="rec4CiBoQIk6zfQ6t" class="Vx877" aria-selected="false">Las Vegas - NV</option><option value="rec0zYEM3uMleOZsy" class="Vx877" aria-selected="false">Lexington - KY</option><option value="rec9pn8NFICAMyoLA" class="Vx877" aria-selected="false">Lincoln - NE</option><option value="recp4CkmZ6jBirp2d" class="Vx877" aria-selected="false">Little Rock - AR</option><option value="recj1K5GgKGONuSOg" class="Vx877" aria-selected="false">London - ON - CANADA</option><option value="recBfObanuCezQdcy" class="Vx877" aria-selected="false">Long Beach - CA</option><option value="rec4Ipx8SeP4D2GoE" class="Vx877" aria-selected="false">Los Angeles - CA</option><option value="recsjocTA0xK1ByRv" class="Vx877" aria-selected="false">Louisville - KY</option><option value="recKg5TIqVmOPWOYB" class="Vx877" aria-selected="false">Macon - GA</option><option value="recyK8Jvbfkvl7s8w" class="Vx877" aria-selected="false">Madison - WI</option><option value="recFn0CKcqbARs9CQ" class="Vx877" aria-selected="false">Melbourne - AU</option><option value="reci5LyJSRQeOtiuq" class="Vx877" aria-selected="false">Memphis - TN</option><option value="recO0eFsLTTpE8TLg" class="Vx877" aria-selected="false">Miami - FL</option><option value="rechNRtLPbBONfDte" class="Vx877" aria-selected="false">Milwaukee - WI</option><option value="recf1aXn7n93jYGIU" class="Vx877" aria-selected="false">Minneapolis - MN</option><option value="reczj3I4MWtu6guMN" class="Vx877" aria-selected="false">Monterey - CA</option><option value="recE1xV6kNFs8BSM7" class="Vx877" aria-selected="false">Montgomery County - MD</option><option value="reciFAcu9Wf3YekS3" class="Vx877" aria-selected="false">Montreal - QC - CANADA</option><option value="rec0NvGJPTPOmmuzT" class="Vx877" aria-selected="false">Morton Grove - IL</option><option value="recBSKjurdl5FeRPI" class="Vx877" aria-selected="false">Mountain View - CA</option><option value="recMkdyzF0EbiBjee" class="Vx877" aria-selected="false">Muskegon - MI</option><option value="reczCcvneOaFpSW5s" class="Vx877" aria-selected="false">Nashville - TN</option><option value="recNcdNIbWcwDygMn" class="Vx877" aria-selected="false">New Orleans - LA</option><option value="rechtyogSfYj79WaB" class="Vx877" aria-selected="false">New York City - NY</option><option value="recVrqfsjAdg5fPW2" class="Vx877" aria-selected="false">Oak Park - IL</option><option value="recmXRje9TvulEldk" class="Vx877" aria-selected="false">Oakland - CA</option><option value="rec1ki6TqUVqyjehf" class="Vx877" aria-selected="false">Omaha - NE</option><option value="recaDKWbgNygOFaFv" class="Vx877" aria-selected="false">Orlando - FL</option><option value="recm7Dw3KfwC4BWbz" class="Vx877" aria-selected="false">Oxford - UK</option><option value="recusyDE3ZdDwAVRq" class="Vx877" aria-selected="false">Palm Springs - CA</option><option value="recQFj44jbSm50hs8" class="Vx877" aria-selected="false">Palo Alto - CA</option><option value="recqGbhHl6OmkeTxh" class="Vx877" aria-selected="false">Paris - FR</option><option value="rec0ItKa6RurIPn1m" class="Vx877" aria-selected="false">Philadelphia - PA</option><option value="recTijMbaJdbds53w" class="Vx877" aria-selected="false">Phoenix - AZ</option><option value="recMvbmn4tmPQoU3F" class="Vx877" aria-selected="false">Pittsburgh - PA</option><option value="recchqqq8itRBIQFN" class="Vx877" aria-selected="false">Port Townsend - WA</option><option value="recUDZlmkJXB60B5J" class="Vx877" aria-selected="false">Portland - OR</option><option value="recAdvUy5RAnpCMpP" class="Vx877" aria-selected="false">Providence - RI</option><option value="recofFKcKeO0P4iwL" class="Vx877" aria-selected="false">Provincetown - MA</option><option value="recjbYWFPyFPGzFKT" class="Vx877" aria-selected="false">Raleigh - NC</option><option value="rece0Nr1ZwJcrBqRK" class="Vx877" aria-selected="false">Richmond - VA</option><option value="rec1z84sBN9dVyA91" class="Vx877" aria-selected="false">Rochester - MN</option><option value="recobBsptoMPPn5qM" class="Vx877" aria-selected="false">Rochester - NY</option><option value="recOaIX00c7OBvyLS" class="Vx877" aria-selected="false">Rockford - IL</option><option value="recUFB7OopgxqEswb" class="Vx877" aria-selected="false">Sacramento - CA</option><option value="recbrQBthhNhOOcII" class="Vx877" aria-selected="false">Saint Louis - MO</option><option value="recrHwbEwThzJdZHG" class="Vx877" aria-selected="false">Salem - OR</option><option value="recKKc25d7tSLqfyw" class="Vx877" aria-selected="false">Salt Lake City - UT</option><option value="recQEk6eHO4Vf3GKx" class="Vx877" aria-selected="false">San Antonio - TX</option><option value="recocbhxiN3b2wybA" class="Vx877" aria-selected="false">San Diego - CA</option><option value="rectOSzEeSmu095gL" class="Vx877" aria-selected="false">San Francisco - CA</option><option value="recRcsnpheMolvFx8" class="Vx877" aria-selected="false">San Jose - CA</option><option value="recOJ7EKqQHx3voBR" class="Vx877" aria-selected="false">San Luis Obispo - CA</option><option value="recEP5J6IgOHS9RKp" class="Vx877" aria-selected="false">Santa Barbara - CA</option><option value="recfgK4EicGNuu2BG" class="Vx877" aria-selected="false">Sarasota - FL</option><option value="recxN8Kff1Mkh2aX0" class="Vx877" aria-selected="false">Savannah - GA</option><option value="recyizZzLEruCI8ih" class="Vx877" aria-selected="false">Scottsdale - AZ</option><option value="rec1S52qlJ9vxvrXZ" class="Vx877" aria-selected="false">Seattle - WA</option><option value="reclcFquset5QLe95" class="Vx877" aria-selected="false">Somerville - MA</option><option value="recXdQQfgBkGXxzow" class="Vx877" aria-selected="false">South Bend - IN</option><option value="recNJSnosJjE98Rvm" class="Vx877" aria-selected="false">Spokane - WA</option><option value="rec0Aq0YUl4HTtI0o" class="Vx877" aria-selected="false">St. Paul - MN</option><option value="recy8tBUHigDfopOC" class="Vx877" aria-selected="false">St. Petersburg - FL</option><option value="recKGxCtSAIjUDnim" class="Vx877" aria-selected="false">Sunnyvale - CA</option><option value="rec2WSUD2RpfTSrZx" class="Vx877" aria-selected="false">Sydney - AU</option><option value="rec50haRLSKojd6gI" class="Vx877" aria-selected="false">Tacoma - WA</option><option value="rec5oZIDdVGbQQWG7" class="Vx877" aria-selected="false">Tallahassee - FL</option><option value="rec0kU0azkoYcEWZw" class="Vx877" aria-selected="false">Tampa - FL</option><option value="recLCU57Mj7VSfPuK" class="Vx877" aria-selected="false">Tempe - AZ</option><option value="reckLy1atM98yH5fr" class="Vx877" aria-selected="false">Thousand Oaks - CA</option><option value="recgeYw5wPSMRPjBB" class="Vx877" aria-selected="false">Toledo - OH</option><option value="rec9a8A9VRy69xYvh" class="Vx877" aria-selected="false">Toronto - ON - CANADA</option><option value="recqFe7TA6SBiCMe1" class="Vx877" aria-selected="false">Townsend - WA</option><option value="rechmuTJnpGwP0ygD" class="Vx877" aria-selected="false">Tri-Cities - WA</option><option value="recKwydbB8UIzM87F" class="Vx877" aria-selected="false">Tucson - AZ</option><option value="recZJPOHoBs0BIO64" class="Vx877" aria-selected="false">Tulsa - OK</option><option value="recWEZSldnOhJPQCw" class="Vx877" aria-selected="false">Urbana - IL</option><option value="recgGSAMom2qKtpM3" class="Vx877" aria-selected="false">Vancouver - BC - CANADA</option><option value="recqlIV9mxa0dqipk" class="Vx877" aria-selected="false">Vancouver - WA</option><option value="reclcVu6YqtUvuQWA" class="Vx877" aria-selected="false">Victoria - BC - CANADA</option><option value="recwYcFEZ3Pk11QiZ" class="Vx877" aria-selected="false">Washington - DC</option>
                </select>
            </div>
            <div class="form-group">
                <label for="geoLocation">Location</label>
                <input type="text" class="form-control" id="geoLocation" value="" disabled/>
                <button type="button" class="btn btn-primary" onClick={()=>getLocation()}>Get Location</button>
            </div> 
            <div class="form-group">
                <label for="exampleFormControlInput1">License Plate #</label>
                <input type="email" class="form-control" id="license_plate" placeholder="CD 80519"/>
            </div>
            <div class="form-group">
                <label for="exampleFormControlTextarea1">Notes</label>
                <textarea class="form-control" id="notes" rows="3"></textarea>
            </div>
            <div class="form-group">
                {/* <label for="exampleFormControlFile1">Upload an Image:    </label> */}
                {/* <input type="file" onChange={handleChange}/> */}
                <img src={file} alt={"Preview"}/>
                <input
              type="file"
              id="single"
              accept="image/*"
            //   onChange={uploadAvatar}
              //disabled={uploading}
            />
            </div>

            <button type="button" class="btn btn-primary" onClick={submitButtonClick}>Submit</button>
        </form>
        </div>
        </>
    )
}

export default SubmitObstruction