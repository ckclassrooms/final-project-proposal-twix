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
  const incomingData  = await req.json()
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
    console.log("Incoming data",incomingData)



  const supabaseQuery = supabase
  .from('violations')
  .select('id,violation_type,user_id,ts,metro_city,license_plate,lat,lon,image_url');

  if(incomingData["violation_type" as keyof typeof incomingData]){
    supabaseQuery.in('violation_type',incomingData["violation_type" as keyof typeof incomingData])
  }

  if(incomingData["ts1" as keyof typeof incomingData] && incomingData["ts2" as keyof typeof incomingData] ){
    const ts1 = incomingData["ts1" as keyof typeof incomingData]
    const ts2 = incomingData["ts2" as keyof typeof incomingData]
    const t1=new Date(Date.parse(ts1))
    const t2= new Date(Date.parse(ts2))
    console.log(t1<t2)
    console.log(t1)
    console.log(t2)
    if(ts1<=ts2){
      supabaseQuery.gte('ts',ts1)
      supabaseQuery.lte('ts',ts2)
    }
    else {
      return new Response(JSON.stringify({ error: "Timestamp1 < timestamp2" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  }
  if(incomingData["metro_city" as keyof typeof incomingData]){
    supabaseQuery.in('metro_city',incomingData["metro_city" as keyof typeof incomingData])
  }
  if(incomingData["license_plate" as keyof typeof incomingData]){
    supabaseQuery.in('license_plate',incomingData["license_plate" as keyof typeof incomingData])
  }
  // supabaseQuery.eq('images.id','id');
  const { data, error } = await supabaseQuery
 
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders,"Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
