// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@v2.0.6'
console.log("Hello from Functions!")
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
}


const createGeoJSON= (data1:object[])=> {
  // console.log(data1);
  // console.log(typeof data1)
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
        "image_url":obj["image_url" as keyof typeof obj],
        "icon":{
          "iconSize": [50, 50],
          "iconAnchor": [25, 25],
          "popupAnchor": [0, -55],
          "className": "dot",
          "iconUrl": icon_url
        }
      },
      "geometry": {
        "coordinates": [obj["lon" as keyof typeof obj],obj["lat" as keyof typeof obj]],
        "type": "Point"
      }
    }
      features.push(inner);
    }
    
    // console.log(features)
    d = {
      "features":features,
      "type": "FeatureCollection"
    }
    return d;
}


serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  if (req.method === 'OPTIONS') {
    return new Response(
      'ok',
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Expose-Headers": "Content-Length, X-JSON",
          "Access-Control-Allow-Headers": "apikey,X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
        }
      }
    );
  }
  const incomingData = await req.json()

  const cats1 = <object[]>incomingData["cats" as keyof typeof incomingData ]
  console.log("cats1",cats1)
  let cats2=null
  if(cats1!=null && Object.keys(cats1).length>0)
    cats2=cats1
  else
    cats2=["CONSTRUCTION_VEHICLE","COMPANY","MUNICIPAL_VEHICLE","PRIVATE_VEHICLE","TAXI","OTHER"]


  var lineString="SRID=4326;LINESTRING(";
  const incomingPoly = incomingData["poly" as keyof typeof incomingData]
  for (const i in incomingPoly) {
    const eachLoc = incomingPoly[i];
    if(eachLoc.length >2 || eachLoc.length <2){
      return new Response(
        JSON.stringify({"error":"Invalid length"}),
        { headers: { ...corsHeaders,"Content-Type": "application/json" },
        status: 400, },
        
      ) 
    }
      
    lineString=lineString+eachLoc[0]+" "+eachLoc[1]+",";
  }
  lineString=lineString+incomingPoly[0][0]+" "+incomingPoly[0][1]+")";
  console.log(lineString)

  const { error, data } = await supabase.rpc('polygon_map', {locs:lineString,
   cats:cats2 });
   var res= createGeoJSON(<object[]>data);

  return new Response(
    JSON.stringify(res),
    { headers: { ...corsHeaders,"Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
