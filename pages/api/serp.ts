// /pages/api/serp.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        api_key: process.env.NEXT_PUBLIC_SERP_API_KEY,
        q,
        num: 100,
        hl: "tr",
        gl: "tr",
      },
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    console.error("Proxy API hatası:", err.message);
    res.status(500).json({ error: "Proxy API hatası: " + err.message });
  }
}
