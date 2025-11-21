export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  if (!BASEROW_TOKEN) {
    return res.status(500).json({ error: "BASEROW_TOKEN not configured" });
  }

  const BASEROW_ENDPOINT =
    "https://api.baserow.io/api/database/rows/table/742957/?user_field_names=true&order_by=-id&page_size=100";

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
      return res.status(response.status).json({ error: text || "Baserow error" });
    }

    const data = await response.json();
    // Baserow returns { count, next, previous, results: [...] }
    res.status(200).json({ results: data.results || [] });
  } catch (err) {
    console.error("Error fetching observations from Baserow", err);
    res.status(500).json({ error: "Server error" });
  }
}
