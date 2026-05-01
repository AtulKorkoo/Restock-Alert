import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const providedSecret = request.headers.get("x-restock-secret")
  const expectedSecret = process.env.RESTOCK_API_SECRET
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { product_name, product_url, state, recipient_email } = body

    if (!product_name || !product_url || !state || !recipient_email) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, product_url, state, recipient_email' },
        { status: 400 }
      )
    }

    const stateLabel = state === 'in_stock' ? 'IN STOCK' : 'PRE-ORDER OPEN'
    const stateVerb = state === 'in_stock' ? 'just dropped' : 'pre-orders are open'

    const { data, error } = await resend.emails.send({
      from: 'Restock Alerts <alerts@restockalerts.co.uk>',
      to: recipient_email,
      subject: `⚡ CATCH IT — ${product_name} ${stateVerb}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>Catch it</title>
<style type="text/css">
:root { color-scheme: dark; supported-color-schemes: dark; }
body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }

.dark-yellow { color:#FFD93D !important; }
[data-ogsc] .dark-yellow,
[data-ogsb] .dark-yellow { color:#FFD93D !important; }
u + .body .dark-yellow,
u + #body .dark-yellow { color:#FFD93D !important; }

.cta-bg,
td.cta-bg,
table.cta-bg {
  background:#FFD93D !important;
  background-color:#FFD93D !important;
  mix-blend-mode:normal !important;
  filter:none !important;
}
[data-ogsc] .cta-bg,
[data-ogsb] .cta-bg,
[data-ogsc] td.cta-bg,
[data-ogsb] td.cta-bg {
  background:#FFD93D !important;
  background-color:#FFD93D !important;
}
u + .body .cta-bg,
u + #body .cta-bg { background-color:#FFD93D !important; }

.logo-mark,
td.logo-mark {
  background:#FFD93D !important;
  background-color:#FFD93D !important;
  mix-blend-mode:normal !important;
  filter:none !important;
}
[data-ogsc] .logo-mark,
[data-ogsb] .logo-mark,
[data-ogsc] td.logo-mark,
[data-ogsb] td.logo-mark {
  background:#FFD93D !important;
  background-color:#FFD93D !important;
}

@media (prefers-color-scheme: dark) {
  .dark-yellow { color:#FFD93D !important; }
  .cta-bg, td.cta-bg { background-color:#FFD93D !important; }
  .logo-mark, td.logo-mark { background-color:#FFD93D !important; }
}
</style>
</head>
<body class="body" id="body" style="margin:0; padding:0; background-color:#1A1623; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

<div style="display:none; max-height:0; overflow:hidden; color:#1A1623; opacity:0;">
${product_name} ${stateVerb}. Caught it before the bots.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1A1623;">
<tr>
<td align="center" style="padding:32px 16px;">

<table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="max-width:540px; width:100%;">

<tr>
<td style="padding:0 8px 24px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td bgcolor="#FFD93D" class="logo-mark" style="background:#FFD93D !important; background-color:#FFD93D !important; width:24px; height:24px; text-align:center; vertical-align:middle; mso-line-height-rule:exactly; line-height:24px;">
<span style="display:inline-block; width:8px; height:8px; background:#1A1623 !important; background-color:#1A1623 !important; line-height:8px; font-size:0;">&nbsp;</span>
</td>
<td style="padding-left:10px; color:#F0E6D2; font-size:14px; font-weight:500; letter-spacing:-0.01em;">
restock alerts
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 8px 16px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(240,230,210,0.2);">
<tr>
<td style="background-color:rgba(255,217,61,0.10); padding:6px 12px; border-right:1px solid rgba(240,230,210,0.2); font-size:11px; font-weight:500; letter-spacing:0.18em;" class="dark-yellow">
<font color="#FFD93D">●</font>&nbsp;<font color="#FFD93D">${stateLabel}</font>
</td>
<td style="padding:6px 12px; color:#B8B0A0; font-size:11px; font-weight:500; letter-spacing:0.18em;">
JUST NOW
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:8px 8px 24px 8px;">
<h1 style="margin:0; color:#F0E6D2; font-size:38px; line-height:1.05; letter-spacing:-0.03em; font-weight:800; text-transform:uppercase; font-family: Impact, 'Helvetica Neue', Helvetica, Arial, sans-serif;">
CATCH IT.&nbsp;<font color="#FFD93D" class="dark-yellow">⚡</font>
</h1>
</td>
</tr>

<tr>
<td style="padding:0 8px 24px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#221C2E; border:1px solid rgba(240,230,210,0.15);">
<tr>
<td style="padding:24px;">

<div style="color:#8B8478; font-size:10px; letter-spacing:0.18em; padding-bottom:12px;">
— PRODUCT
</div>

<div style="color:#F0E6D2; font-size:22px; font-weight:600; line-height:1.2; padding-bottom:20px; letter-spacing:-0.01em;">
${product_name}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px dashed rgba(240,230,210,0.2); border-bottom:1px dashed rgba(240,230,210,0.2);">
<tr>
<td style="padding:14px 0; color:#8B8478; font-size:11px; letter-spacing:0.14em;">
STATUS
</td>
<td align="right" style="padding:14px 0; font-size:11px; font-weight:500; letter-spacing:0.14em;" class="dark-yellow">
<font color="#FFD93D">${stateLabel}</font>
</td>
</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;" class="cta-bg">
<tr>
<td bgcolor="#FFD93D" class="cta-bg" style="background:#FFD93D !important; background-color:#FFD93D !important; mso-padding-alt:0;">
<a href="${product_url}" style="display:block; background:#FFD93D !important; background-color:#FFD93D !important; color:#1A1623 !important; padding:14px 28px; text-decoration:none; font-weight:700; font-size:15px; letter-spacing:0.02em; border:2px solid #1A1623; mso-padding-alt:0;">
<font color="#1A1623"><strong>VIEW DROP &nbsp;→</strong></font>
</a>
</td>
</tr>
</table>

<div style="padding-top:14px; color:#8B8478; font-size:11px; letter-spacing:0.06em;">
Move fast. These don't sit.
</div>

</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:24px 8px 0 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(240,230,210,0.1);">
<tr>
<td style="padding:24px 0; text-align:center;">
<div style="color:#8B8478; font-size:11px; letter-spacing:0.06em; line-height:1.6;">
You're getting this because you're tracking <strong style="color:#B8B0A0;">${product_name}</strong>.<br/>
Caught by the watcher · Sent from <a href="https://restockalerts.co.uk" style="color:#FFD93D; text-decoration:none;" class="dark-yellow"><font color="#FFD93D">restockalerts.co.uk</font></a>
</div>
</td>
</tr>
<tr>
<td style="padding:0 0 16px 0; text-align:center;">
<a href="https://restockalerts.co.uk/dashboard" style="color:#8B8478; font-size:11px; text-decoration:underline; letter-spacing:0.04em;">Manage what you track</a>
</td>
</tr>
</table>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, email_id: data?.id })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
