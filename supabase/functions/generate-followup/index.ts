import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestBody {
  clientName: string;
  meetingContext: string;
  userEmail?: string;
  userName?: string;
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseKey =process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { clientName, meetingContext, userEmail = 'you@example.com', userName = 'Your Name' } = await req.json() as RequestBody;

    if (!clientName || !meetingContext) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // In a production environment, you would use OpenAI API here
    // This is a simple template-based approach for the MVP
    const followupEmail = `Dear ${clientName},

Thank you for taking the time to meet with me yesterday to discuss your project needs. I appreciated the opportunity to learn more about your goals and challenges.

Based on our conversation about ${meetingContext}, I wanted to follow up with some additional thoughts and resources that might be helpful as you consider next steps.

Would you be available for a brief call next week to discuss this further? I'm available Tuesday or Thursday afternoon if either works for you.

Looking forward to hearing from you.

Best regards,
${userName}
${userEmail}`;

    return new Response(
      JSON.stringify({ content: followupEmail }),
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