export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  if (!BASEROW_TOKEN) {
    return res.status(500).json({ error: "Missing BASEROW_TOKEN" });
  }

  // FIX: removed user_field_names=true, uses internal field names
  const BASEROW_ENDPOINT =
    "https://api.baserow.io/api/database/rows/table/742957/?order_by=-id&page_size=100";

  try {
    const response = await fetch(BASEROW_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: "Token " + BASEROW_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json({ results: data.results || [] });

  } catch (err) {
    console.error("API /observations error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
