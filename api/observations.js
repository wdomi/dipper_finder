export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  if (!BASEROW_TOKEN) {
    return res.status(500).json({ error: "BASEROW_TOKEN not configured" });
  }

  // ✅ NO order_by in request
  const BASEROW_ENDPOINT =
    "https://api.baserow.io/api/database/rows/table/742957/?page_size=100&user_field_names=false";

  try {
    const response = await fetch(BASEROW_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: "Token " + BASEROW_TOKEN,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res
        .status(response.status)
        .json({ error: text || "Baserow error" });
    }

    const data = await response.json();

    // ✅ sort newest first using internal primary key
    const sorted = (data.results || []).sort((a, b) =>
      (b.id ?? 0) - (a.id ?? 0)
    );

    res.status(200).json({ results: sorted });
  } catch (err) {
    console.error("Error fetching observations from Baserow", err);
    res.status(500).json({ error: "Server error" });
  }
}
