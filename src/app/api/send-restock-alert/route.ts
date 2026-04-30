import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend client with API key from environment variables.
// We use the non-public RESEND_API_KEY (no NEXT_PUBLIC_ prefix) because
// this code runs server-side only and the key must NEVER reach the browser.
const resend = new Resend(process.env.RESEND_API_KEY)

// POST handler — this is the function Next.js calls when someone sends a
// POST request to /api/send-restock-alert. The Pokemon alerter will be the caller.
export async function POST(request: NextRequest) {
  // Check the secret header before doing anything else
  const providedSecret = request.headers.get("x-restock-secret")
  const expectedSecret = process.env.RESTOCK_API_SECRET
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Parse the JSON body the alerter sends us. We expect 4 fields:
    // product_name, product_url, state ("in_stock" or "pre_order"), recipient_email.
    const body = await request.json()
    const { product_name, product_url, state, recipient_email } = body

    // Basic validation — refuse the request if any required field is missing.
    // Returning 400 (Bad Request) tells the caller they messed up the payload.
    if (!product_name || !product_url || !state || !recipient_email) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, product_url, state, recipient_email' },
        { status: 400 }
      )
    }

    // Build a human-readable state label for the email subject and body.
    // "in_stock" -> "BACK IN STOCK", "pre_order" -> "PRE-ORDER OPEN".
    const stateLabel = state === 'in_stock' ? 'BACK IN STOCK' : 'PRE-ORDER OPEN'

    // Send the email via Resend. The "from" address uses Resend's testing domain
    // (onboarding@resend.dev) since we haven't verified our own domain yet.
    // We'll switch this to alerts@restockalerts.io once we own a domain.
    const { data, error } = await resend.emails.send({
      from: 'Restock Alerts <alerts@restockalerts.co.uk>',
      to: recipient_email,
      subject: `🔥 ${product_name} — ${stateLabel}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0f172a; margin: 0 0 16px;">${stateLabel}</h2>
          <p style="font-size: 18px; color: #0f172a; margin: 0 0 8px;"><strong>${product_name}</strong></p>
          <p style="color: #475569; margin: 0 0 24px;">A product you're tracking just changed status.</p>
          <a href="${product_url}" style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">View product →</a>
          <p style="color: #94a3b8; font-size: 12px; margin: 32px 0 0;">Sent by Restock Alerts</p>
        </div>
      `,
    })

    // Resend returns either { data, error: null } on success or { data: null, error }.
    // If error is non-null something went wrong on Resend's end — bubble it up so we know.
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Success! Return the Resend email ID so we can debug later if needed.
    return NextResponse.json({ success: true, email_id: data?.id })
  } catch (err) {
    // Catch any unexpected errors (JSON parse failures, network issues, etc).
    console.error('Email API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
