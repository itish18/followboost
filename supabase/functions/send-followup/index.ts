import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SendEmailRequest {
  followupId: string;
  sendNow?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client with Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { followupId, sendNow = true } = await req.json() as SendEmailRequest;

    if (!followupId) {
      return new Response(
        JSON.stringify({ error: 'Missing followupId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the followup from the database
    const { data: followup, error: followupError } = await supabase
      .from('followups')
      .select('*, clients!inner(*)')
      .eq('id', followupId)
      .single();

    if (followupError || !followup) {
      return new Response(
        JSON.stringify({ error: 'Followup not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // In a production app, this would integrate with an email sending service
    // For this MVP, we'll simulate email sending by updating the database
    
    // Update the followup status
    let status = 'sent';
    let updateData: any = { 
      status, 
      sent_date: new Date().toISOString() 
    };
    
    if (!sendNow) {
      status = 'scheduled';
      updateData = { 
        status,
        scheduled_date: followup.scheduled_date || new Date().toISOString()
      };
    }

    const { error: updateError } = await supabase
      .from('followups')
      .update(updateData)
      .eq('id', followupId);

    if (updateError) {
      console.error('Error updating followup:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update followup status' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: sendNow ? 'Email sent successfully' : 'Email scheduled successfully',
        status
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error(error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});