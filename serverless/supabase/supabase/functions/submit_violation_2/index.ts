// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@v2.0.6'
console.log("Hello from Functions!")
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}
serve(async (req) => {
  
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
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if(user==null)
  return new Response(JSON.stringify({ error: "Unauthorized " }), {
    headers: { 'Content-Type': 'application/json' },
    status: 401,
  })
  console.log("User details ",user)
  var lat=null,lon=null,license_plate=null,image_url=null,notes=null,violation_type=null,metro_city=null;

  var user_id = user["id"]

  if("lat" in incomingData && "lon" in incomingData){
    lat=incomingData["lat" as keyof typeof incomingData]
    lon=incomingData["lon" as keyof typeof incomingData]
  }
  if("license_plate" in incomingData)
    license_plate=incomingData["license_plate" as keyof typeof incomingData]
  
  if("notes" in incomingData)
    notes=incomingData["notes" as keyof typeof incomingData]
  
  if("image_url" in incomingData)
    image_url=incomingData["image_url" as keyof typeof incomingData]

  if("violation_type" in incomingData)
    violation_type=incomingData["violation_type" as keyof typeof incomingData]

  if("metro_city" in incomingData)
    metro_city=incomingData["metro_city" as keyof typeof incomingData]
  
  if( violation_type===null || metro_city===null){
    return new Response(JSON.stringify({ error: "violation_type, metro_city fields are mandatory " }), {
      headers: {  ...corsHeaders,'Content-Type': 'application/json' },
      status: 400,
    })
  }
  const time = new Date().toISOString();
  const body ={ 
    "user_number": user_id ,
    "violation_type": violation_type,
    "lat":lat,
    "lon":lon,
    "metro_city":metro_city,
    "license_plate":license_plate,
    "ts":time,
    "image_url":image_url,
    "notes":notes
    }
  console.log("Payload body = ",body)
  const { error, data } = await supabase.rpc('insert_into_table',body); 
  console.log("Incoming data",incomingData)
  console.log("data res",data)
  console.log("error res",error)
  if(error){
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {  ...corsHeaders,'Content-Type': 'application/json' },
      status: 400,
    })
  }
  return new Response(
    JSON.stringify({data:data}),
    { headers: {  ...corsHeaders,"Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
