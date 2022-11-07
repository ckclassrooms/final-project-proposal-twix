// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12'

console.log("Hello from Functions!")

const createGeoJSON= (data1:object)=> {
  console.log(data1);
    var de = {};
    var features=[]
    de.features=features
    console.log(de)
    for(let i = 0; i < data1.length; i++) {
      let obj = data1[i];
      var icon_url="";
      if(obj["violation_type"]=="TAXI")
        icon_url="icons8-oncoming-taxi-48.png"
      else
      var icon_url="construction.png"
      var inner = {
        "type": "Feature",
      "properties": {
        "violation": obj["violation_type"],
        "time": obj["ts"],
        "icon":{
          "iconSize": [50, 50],
          "iconAnchor": [25, 25],
          "popupAnchor": [0, -55],
          "className": "dot",
          "iconUrl": icon_url
        }
      },
      "geometry": {
        "coordinates": [obj["lat"],obj["lon"]],
        "type": "Point"
      }
    }
      features.push(inner);
  
      
    }
    
    console.log(de)
    return de
}


serve(async (req) => {
  const  data  = await req.json()
  console.log(data)
 try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabase = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    

    const { data, error } = await supabase.rpc('get_points1', { lat1: -87.651769, lon1:41.880070,lat2: -87.647589, lon2:41.869612, cats:['TAXI'] })
    
    // prints out the contents of the file

      // var res= createGeoJSON(data)
      console.log(typeof data)
    return new Response(JSON.stringify( "" ), {
      headers: {  'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: {  'Content-Type': 'application/json' },
      status: 400,
    })
  }
  return new Response(
    JSON.stringify("res"),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
