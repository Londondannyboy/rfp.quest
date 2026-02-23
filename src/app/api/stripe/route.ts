import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// Stripe product/price IDs (would be in env vars in production)
const PRICE_IDS = {
  starter_monthly: process.env.STRIPE_STARTER_MONTHLY || 'price_starter_monthly',
  starter_annual: process.env.STRIPE_STARTER_ANNUAL || 'price_starter_annual',
  professional_monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY || 'price_professional_monthly',
  professional_annual: process.env.STRIPE_PROFESSIONAL_ANNUAL || 'price_professional_annual',
  agency_monthly: process.env.STRIPE_AGENCY_MONTHLY || 'price_agency_monthly',
  agency_annual: process.env.STRIPE_AGENCY_ANNUAL || 'price_agency_annual',
};

// Create Stripe checkout session
export async function POST(req: NextRequest) {
  try {
    const { priceId, teamId, userId, successUrl, cancelUrl } = await req.json();

    if (!priceId || !teamId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if team already has a subscription
    const existingSubscription = await sql`
      SELECT * FROM team_subscriptions 
      WHERE team_id = ${teamId} 
      AND status IN ('active', 'trialing')
      LIMIT 1
    `;

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        { error: 'Team already has an active subscription' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;
    const teamData = await sql`
      SELECT * FROM teams WHERE id = ${teamId} LIMIT 1
    `;

    if (teamData[0]?.stripe_customer_id) {
      customerId = teamData[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        metadata: {
          team_id: teamId,
          user_id: userId,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await sql`
        UPDATE teams 
        SET stripe_customer_id = ${customerId}
        WHERE id = ${teamId}
      `;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          team_id: teamId,
          user_id: userId,
        },
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/pricing?subscription=cancelled`,
      metadata: {
        team_id: teamId,
        user_id: userId,
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Handle subscription updates
export async function PUT(req: NextRequest) {
  try {
    const { teamId, action, targetPriceId } = await req.json();

    if (!teamId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscription = await sql`
      SELECT * FROM team_subscriptions 
      WHERE team_id = ${teamId} 
      AND status = 'active'
      LIMIT 1
    `;

    if (subscription.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const stripeSubscriptionId = subscription[0].stripe_subscription_id;

    switch (action) {
      case 'upgrade':
      case 'downgrade':
        // Change subscription plan
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        await stripe.subscriptions.update(stripeSubscriptionId, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              price: targetPriceId,
            },
          ],
          proration_behavior: 'always_invoice',
        });
        break;

      case 'cancel':
        // Cancel at period end
        await stripe.subscriptions.update(stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
        
        await sql`
          UPDATE team_subscriptions 
          SET cancel_at_period_end = true
          WHERE team_id = ${teamId}
        `;
        break;

      case 'reactivate':
        // Reactivate cancelled subscription
        await stripe.subscriptions.update(stripeSubscriptionId, {
          cancel_at_period_end: false,
        });
        
        await sql`
          UPDATE team_subscriptions 
          SET cancel_at_period_end = false
          WHERE team_id = ${teamId}
        `;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// Get subscription status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID required' },
        { status: 400 }
      );
    }

    const subscription = await sql`
      SELECT 
        ts.*,
        st.name as tier_name,
        st.monthly_price,
        st.annual_price,
        st.credits_per_month,
        st.features
      FROM team_subscriptions ts
      JOIN subscription_tiers st ON ts.tier_id = st.id
      WHERE ts.team_id = ${teamId}
      AND ts.status IN ('active', 'trialing')
      LIMIT 1
    `;

    if (subscription.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    // Get credit balance
    const credits = await sql`
      SELECT * FROM team_credits
      WHERE team_id = ${teamId}
      LIMIT 1
    `;

    // Get usage statistics
    const usage = await sql`
      SELECT 
        COUNT(*) as total_enrichments,
        SUM(ABS(credits_amount)) as credits_used
      FROM credit_transactions
      WHERE team_id = ${teamId}
      AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND transaction_type = 'enrichment'
    `;

    return NextResponse.json({
      subscription: subscription[0],
      credits: credits[0] || null,
      usage: usage[0] || { total_enrichments: 0, credits_used: 0 },
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}