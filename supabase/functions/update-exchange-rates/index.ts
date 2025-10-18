import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting exchange rate update job...');

    // Fetch DZD to EUR rate from Oanda
    const oandaResponse = await fetch(
      'https://www.oanda.com/fx-for-business/api/hnav/daily/EUR/DZD/last/1'
    );

    if (!oandaResponse.ok) {
      throw new Error(`Oanda API error: ${oandaResponse.statusText}`);
    }

    const oandaData = await oandaResponse.json();
    const dzdToEurRate = 1 / oandaData.quotes[0].midpoint; // Convert EUR/DZD to DZD/EUR
    
    console.log(`Fetched DZD to EUR rate: ${dzdToEurRate}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update or insert the exchange rate in platform_settings
    const { error: upsertError } = await supabase
      .from('platform_settings')
      .upsert({
        setting_key: 'exchange_rates',
        setting_value: {
          dzd_to_eur_rate: dzdToEurRate,
          last_updated: new Date().toISOString(),
          source: 'oanda'
        }
      }, {
        onConflict: 'setting_key'
      });

    if (upsertError) {
      throw upsertError;
    }

    console.log('Exchange rate updated successfully in platform_settings');

    return new Response(
      JSON.stringify({
        success: true,
        rate: dzdToEurRate,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
