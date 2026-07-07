// Serverless endpoint: receives the lead form POST and fans it out to
// Meta Conversions API, Bitrix24, and WAHA (WhatsApp HTTP API).
//
// Deploy target: Vercel (or any host that runs a Node serverless function
// at /api/lead). Needs Node 18+ for global fetch/crypto.
//
// Required environment variables (set in the hosting dashboard, never in code):
//   META_PIXEL_ID              - Meta Pixel ID (not secret, also used client-side)
//   META_CAPI_ACCESS_TOKEN     - Meta Conversions API access token (secret)
//   META_TEST_EVENT_CODE       - optional, only while testing in Events Manager
//   BITRIX_WEBHOOK_URL         - Bitrix24 inbound webhook base URL with crm.lead.add rights (secret)
//   WAHA_BASE_URL              - e.g. https://your-waha-instance.example.com
//   WAHA_SESSION               - WAHA session name (e.g. "default")
//   WAHA_API_KEY               - WAHA instance API key, if configured (secret)
//   SALES_WHATSAPP_NUMBER      - sales team WhatsApp number in international format, no plus/spaces (e.g. 923011233333)

const crypto = require("crypto");

function sha256(value) {
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

async function sendMetaCAPI(lead, eventId, req) {
  if (!process.env.META_PIXEL_ID || !process.env.META_CAPI_ACCESS_TOKEN) return { skipped: true };

  const url = `https://graph.facebook.com/v20.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_ACCESS_TOKEN}`;
  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // must match the client-side fbq eventID for dedup
        action_source: "website",
        event_source_url: lead.pageUrl || req.headers.referer || "",
        user_data: {
          client_ip_address: req.headers["x-forwarded-for"]?.split(",")[0]?.trim(),
          client_user_agent: req.headers["user-agent"],
          fbp: lead.fbp || undefined,
          fbc: lead.fbc || undefined,
          ph: lead.phone ? [sha256(cleanPhone(lead.phone))] : undefined,
          fn: lead.name ? [sha256(lead.name.split(" ")[0])] : undefined,
        },
        custom_data: {
          content_name: "Box Park III Lead Form",
          interest: lead.interest,
          budget: lead.budget,
          lead_source: lead.utm_source || "website",
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendBitrixLead(lead) {
  if (!process.env.BITRIX_WEBHOOK_URL) return { skipped: true };

  const url = `${process.env.BITRIX_WEBHOOK_URL.replace(/\/$/, "")}/crm.lead.add.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: `Box Park III — ${lead.name}`,
        NAME: lead.name,
        PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
        COMMENTS:
          `Interested in: ${lead.interest || "-"}\n` +
          `Budget: ${lead.budget || "-"}\n` +
          `Requested: ${lead.want || "-"}\n` +
          `Message: ${lead.message || "-"}\n` +
          `Page: ${lead.pageUrl || "-"}\n` +
          `Referrer: ${lead.referrer || "-"}`,
        SOURCE_ID: "WEB",
        SOURCE_DESCRIPTION: "Box Park III Landing Page",
        UTM_SOURCE: lead.utm_source || undefined,
        UTM_MEDIUM: lead.utm_medium || undefined,
        UTM_CAMPAIGN: lead.utm_campaign || undefined,
        UTM_CONTENT: lead.utm_content || undefined,
        UTM_TERM: lead.utm_term || undefined,
      },
    }),
  });
  return res.json();
}

async function sendWahaNotification(lead) {
  if (!process.env.WAHA_BASE_URL || !process.env.SALES_WHATSAPP_NUMBER) return { skipped: true };

  const url = `${process.env.WAHA_BASE_URL.replace(/\/$/, "")}/api/sendText`;
  const text =
    `New Box Park III lead\n` +
    `Name: ${lead.name}\n` +
    `Phone: ${lead.phone}\n` +
    `Interested in: ${lead.interest || "-"}\n` +
    `Budget: ${lead.budget || "-"}\n` +
    `Requested: ${lead.want || "-"}\n` +
    `Message: ${lead.message || "-"}\n` +
    `UTM: ${lead.utm_source || "direct"} / ${lead.utm_campaign || "-"}\n` +
    `Page: ${lead.pageUrl || "-"}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WAHA_API_KEY ? { "X-Api-Key": process.env.WAHA_API_KEY } : {}),
    },
    body: JSON.stringify({
      session: process.env.WAHA_SESSION || "default",
      chatId: `${process.env.SALES_WHATSAPP_NUMBER}@c.us`,
      text,
    }),
  });
  return res.json();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const lead = req.body || {};
  if (!lead.name || !lead.phone) {
    res.status(400).json({ error: "Name and phone are required" });
    return;
  }

  const eventId = lead.eventId || crypto.randomUUID();

  const results = await Promise.allSettled([
    sendMetaCAPI(lead, eventId, req),
    sendBitrixLead(lead),
    sendWahaNotification(lead),
  ]);

  const [capi, bitrix, waha] = results.map((r) =>
    r.status === "fulfilled" ? r.value : { error: String(r.reason) }
  );

  res.status(200).json({ ok: true, eventId, capi, bitrix, waha });
};
