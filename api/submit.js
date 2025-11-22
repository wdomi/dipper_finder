export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  if (!BASEROW_TOKEN) {
    return res.status(500).json({ error: "Missing BASEROW_TOKEN" });
  }

  const {
    bird_name,
    bird_id,
    action,
    latitude,
    longitude,
    territory
  } = req.body;

  const payload = {
    field_6258635: bird_name,
    field_6258636: bird_id,
    field_6258637: action,
    // ✅ REMOVE created_on field_6258638 (Baserow sets automatically)
    field_6258639: latitude,
field_6258640: longitude,
field_6318262: territory || ""
  };

  try {
    const r = await fetch(
      "https://api.baserow.io/api/database/rows/table/742957/",
      {
        method: "POST",
        headers: {
          Authorization: "Token " + BASEROW_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return res.status(r.status).json({ error: text });
    }

    const data = await r.json();
    res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
