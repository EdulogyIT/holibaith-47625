import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  sessionId: string;
  paymentId: string;
}

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment verification started");

    // Initialize Supabase clients (auth client + service client for DB writes)
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const dbClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { sessionId, paymentId }: VerifyPaymentRequest = await req.json();
    logStep("Verification request parsed", { sessionId, paymentId });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      sessionId, 
      paymentStatus: session.payment_status,
      paymentIntentId: session.payment_intent 
    });

    // Get current payment record (using auth client for security)
    const { data: payment, error: paymentFetchError } = await authClient
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', user.id)
      .single();

    if (paymentFetchError || !payment) {
      throw new Error('Payment record not found or access denied');
    }

    let newStatus = payment.status;
    let completedAt = null;
    let paymentIntentId = null;

    // Update payment status based on Stripe session
    if (session.payment_status === 'paid') {
      newStatus = 'completed';
      completedAt = new Date().toISOString();
      paymentIntentId = session.payment_intent as string;
      logStep("Payment successful");
    } else if (session.payment_status === 'unpaid') {
      newStatus = 'failed';
      logStep("Payment failed");
    }

    // Update payment record (using service client for DB writes)
    const { error: updateError } = await dbClient
      .from('payments')
      .update({
        status: newStatus,
        stripe_payment_intent_id: paymentIntentId,
        completed_at: completedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (updateError) {
      throw new Error(`Failed to update payment: ${updateError.message}`);
    }

    // If payment is successful and there's booking data, create the booking (using service client)
    if (newStatus === 'completed' && payment.metadata?.bookingData) {
      const bookingData = payment.metadata.bookingData;
      
      const { data: booking, error: bookingCreateError } = await dbClient
        .from('bookings')
        .insert({
          user_id: user.id,
          property_id: payment.property_id,
          payment_id: paymentId,
          check_in_date: bookingData.checkInDate,
          check_out_date: bookingData.checkOutDate,
          guests_count: bookingData.guestsCount,
          total_amount: payment.amount,
          booking_fee: payment.payment_type === 'booking_fee' ? payment.amount : 0,
          security_deposit: payment.payment_type === 'security_deposit' ? payment.amount : 0,
          special_requests: bookingData.specialRequests,
          contact_phone: bookingData.contactPhone,
          status: 'confirmed',
        })
        .select()
        .single();

      if (bookingCreateError) {
        logStep("Booking creation failed", { error: bookingCreateError.message });
      } else {
        logStep("Booking created successfully", { bookingId: booking.id });
        
        // Get property details for notifications
        const { data: propertyData, error: propertyError } = await dbClient
          .from('properties')
          .select('title, user_id')
          .eq('id', payment.property_id)
          .single();

        if (!propertyError && propertyData) {
          // Send notification to customer
          const { error: customerNotifError } = await dbClient
            .from('notifications')
            .insert({
              user_id: user.id,
              title: 'Booking Confirmed',
              message: `Your booking for "${propertyData.title}" has been confirmed! Check-in: ${bookingData.checkInDate}`,
              type: 'booking_confirmed',
              related_id: booking.id
            });

          if (customerNotifError) {
            logStep("Customer notification failed", { error: customerNotifError.message });
          } else {
            logStep("Customer notification sent");
          }

          // Send notification to host
          const { error: hostNotifError } = await dbClient
            .from('notifications')
            .insert({
              user_id: propertyData.user_id,
              title: 'New Booking Received',
              message: `You have a new booking for "${propertyData.title}". Check-in: ${bookingData.checkInDate}`,
              type: 'booking_received',
              related_id: booking.id
            });

          if (hostNotifError) {
            logStep("Host notification failed", { error: hostNotifError.message });
          } else {
            logStep("Host notification sent");
          }
        }
      }
    }

    logStep("Payment verification completed", { 
      paymentId, 
      newStatus, 
      paymentIntentId 
    });

    return new Response(JSON.stringify({ 
      success: true,
      paymentId,
      status: newStatus,
      paymentIntentId,
      sessionData: {
        paymentStatus: session.payment_status,
        customerDetails: session.customer_details,
        amountTotal: session.amount_total
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});



