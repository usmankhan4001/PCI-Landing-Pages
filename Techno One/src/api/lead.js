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
//   BITRIX_UF_MAPPING          - optional JSON mapping Bitrix24 UF fields to lead data keys
//                                e.g. {"UF_CRM_BUDGET":"budget","UF_CRM_INTEREST":"interest"}
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
          em: lead.email ? [sha256(lead.email)] : undefined,
          fn: lead.name ? [sha256(lead.name.split(" ")[0])] : undefined,
        },
        custom_data: {
          content_name: "Techno One Lead Form",
          interest: lead.interest,
          want: lead.want,
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

function parseWant(want) {
  if (!want) return { request: "-", preferences: null };
  const prefIdx = want.indexOf("(Preferences:");
  if (prefIdx === -1) return { request: want.trim(), preferences: null };
  return {
    request: want.slice(0, prefIdx).trim(),
    preferences: want.slice(prefIdx + 13, -1).trim(),
  };
}

async function sendBitrixLead(lead) {
  if (!process.env.BITRIX_WEBHOOK_URL) return { skipped: true };

  const url = `${process.env.BITRIX_WEBHOOK_URL.replace(/\/$/, "")}/crm.lead.add.json`;

  const { request, preferences } = parseWant(lead.want);

  let comments = "";
  if (lead.interest) comments += `Interest: ${lead.interest}\n`;
  if (request !== "-") comments += `Request: ${request}\n`;
  if (preferences) comments += `Preferences: ${preferences}\n`;
  if (lead.budget) comments += `Budget: ${lead.budget}\n`;
  if (lead.message) comments += `Message: ${lead.message}\n`;
  if (lead.pageUrl) comments += `Source: ${lead.pageUrl}\n`;
  if (lead.referrer && lead.referrer !== lead.pageUrl) comments += `Referrer: ${lead.referrer}`;

  const fields = {
    TITLE: `Techno One — ${lead.name}`,
    NAME: lead.name,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "MOBILE" }],
    EMAIL: lead.email ? [{ VALUE: lead.email, VALUE_TYPE: "WORK" }] : undefined,
    COMMENTS: comments.trim(),
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: "Techno One Landing Page",
    UTM_SOURCE: lead.utm_source || undefined,
    UTM_MEDIUM: lead.utm_medium || undefined,
    UTM_CAMPAIGN: lead.utm_campaign || undefined,
    UTM_CONTENT: lead.utm_content || undefined,
    UTM_TERM: lead.utm_term || undefined,
  };

  // Merge custom UF fields from BITRIX_UF_MAPPING env var
  if (process.env.BITRIX_UF_MAPPING) {
    try {
      const mapping = JSON.parse(process.env.BITRIX_UF_MAPPING);
      for (const [ufCode, dataKey] of Object.entries(mapping)) {
        const val = lead[dataKey];
        if (val !== undefined && val !== null && val !== "") {
          fields[ufCode] = val;
        }
      }
    } catch (_) {
      // silently ignore invalid JSON
    }
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  return res.json();
}

async function sendWahaNotification(lead) {
  if (!process.env.WAHA_BASE_URL || !process.env.SALES_WHATSAPP_NUMBER) return { skipped: true };

  const url = `${process.env.WAHA_BASE_URL.replace(/\/$/, "")}/api/sendText`;
  const text =
    `New Techno One lead\n` +
    `Name: ${lead.name}\n` +
    `Phone: ${lead.phone}\n` +
    `Email: ${lead.email || "-"}\n` +
    `Interested in: ${lead.interest || "-"}\n` +
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
