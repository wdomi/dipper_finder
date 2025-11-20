export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const BASEROW_TOKEN = process.env.BASEROW_TOKEN;
  const BASEROW_ENDPOINT = "https://api.baserow.io/api/database/rows/table/742957/?user_field_names=true";

  try {
    const payload = req.body;
    const response = await fetch(BASEROW_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": "Token " + BASEROW_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({ error: text });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
