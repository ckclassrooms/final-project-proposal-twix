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
  const incomingData = await req.json()
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
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );
  const query =  supabase
  .from('violations')
  if("lat" in incomingData && "lon" in incomingData){
    .insert({  user_id: incomingData["user_id" as keyof typeof incomingData],
    "violation_type": incomingData["violation_type" as keyof typeof incomingData],
    "lat":incomingData["lat" as keyof typeof incomingData],
    "lon":incomingData["lon" as keyof typeof incomingData],
    

    })
  }
  .insert({  user_id: incomingData["user_id" as keyof typeof incomingData],
    "violation_type": incomingData["violation_type" as keyof typeof incomingData],
    })
  console.log("Incoming data",incomingData)

  const { error } = await query
  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
