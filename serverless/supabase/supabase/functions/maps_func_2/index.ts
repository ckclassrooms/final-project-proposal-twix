// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@v2.0.6'
console.log("Hello from Functions!")
const createGeoJSON= (data1:object[])=> {
  console.log(data1);
  console.log(typeof data1)
  let d:object
  let features:object[]=[];

    for(let i = 0; i < data1.length; i++) {
      
      let obj = <object>data1[i];
      var icon_url="";
      
      if(data1[i]["violation_type" as keyof typeof obj]=="TAXI")
        icon_url="icons8-oncoming-taxi-48.png"
      else
      var icon_url="construction.png"
      let inner ={
        "type": "Feature",
        "properties": {
        "violation": obj["violation_type" as keyof typeof obj],
        "time": obj["ts" as keyof typeof obj],
        "icon":{
          "iconSize": [50, 50],
          "iconAnchor": [25, 25],
          "popupAnchor": [0, -55],
          "className": "dot",
          "iconUrl": icon_url
        }
      },
      "geometry": {
        "coordinates": [obj["lat" as keyof typeof obj],obj["lon" as keyof typeof obj]],
        "type": "Point"
      }
    }
      features.push(inner);
    }
    
    console.log(features)
    d = {
      "features":features,
      "type": "FeatureCollection"
    }
    return d;
}


serve(async (req) => {
  const  incomingData  = await req.json()
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  console.log(incomingData)
  console.log(typeof incomingData)
  console.log(">>>>>>")
  const { error, data } = await supabase.rpc('get_points1', { lat1: incomingData["lat1"as keyof typeof incomingData ],
  lon1:incomingData["lon1"as keyof typeof incomingData ],
  lat2: incomingData["lat2"as keyof typeof incomingData ], 
  lon2:incomingData["lon2"as keyof typeof incomingData ],
   cats:incomingData["cats"as keyof typeof incomingData ]  });
    
  // prints out the contents of the file

    var res= createGeoJSON(<object[]>data);
    console.log(typeof data)
  return new Response(JSON.stringify( res ), {
    headers: {  'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
   },
    status: 200,
  })
  
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
