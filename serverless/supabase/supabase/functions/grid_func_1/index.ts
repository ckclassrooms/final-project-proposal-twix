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

function errorResponse(msg:string,code:number){
  return new Response(JSON.stringify({ error: msg }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: code,
  })
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
  const incomingData  = await req.json()
  // const violations = ['CONSTRUCTION_VEHICLE','COMPANY','MUNICIPAL_VEHICLE','PRIVATE_VEHICLE','TAXI','OTHER']
  
  var time1=null,time2=null,violations=null,cities=null
  if(incomingData["violation_type" as keyof typeof incomingData]){
    const violation_type= incomingData["violation_type" as keyof typeof incomingData]
    
    var v2=violation_type.map((element:string, index:number) => {
      
      return escape(element);
    });
    violations=v2;
    
    console.log("violations array ",v2)
  }
 
  if(incomingData["ts1" as keyof typeof incomingData] && incomingData["ts2" as keyof typeof incomingData] ){
    const ts1 = incomingData["ts1" as keyof typeof incomingData]
    const ts2 = incomingData["ts2" as keyof typeof incomingData]
    const t1=new Date(Date.parse(ts1))
    const t2= new Date(Date.parse(ts2))
    console.log("Ts1",t1)
      console.log("ts2",t2)
    console.log(t1<t2)
    if(ts1<=ts2){
      time1=ts1;
      time2=ts2;
      
    }
    else {
      return errorResponse("Timestamp1 < timestamp2",400)
    }
  }
  if(incomingData["metro_city" as keyof typeof incomingData]){
    const mc=incomingData["metro_city" as keyof typeof incomingData].map((element:string,index:number)=> {
      return escape(element)
    })
    cities=mc;
  }

  const payload = { cats: violations,
    cities:cities,
    ts1: time1, 
    ts2:time2}
    console.log("payload ",payload)
  const { error, data } = await supabase.rpc('grid_func_stored', payload);

  console.log(error)


 
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
