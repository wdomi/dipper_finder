export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  if (!BASEROW_TOKEN) {
    return res.status(500).json({ error: "Missing BASEROW_TOKEN" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const payload = {
    field_6351349: true   // ← mark as deleted
  };

  try {
    const r = await fetch(
      "https://api.baserow.io/api/database/rows/table/742957/" + id + "/",
      {
        method: "PATCH",
        headers: {
          Authorization: "Token " + BASEROW_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return res.status(r.status).json({ error: txt });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
