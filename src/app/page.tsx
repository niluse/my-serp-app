"use client";

import { useState } from "react";
import axios from "axios";

interface ResultType {
  keyword: string;
  position: number | null;
  url: string | null;
}

export default function HomePage() {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    console.log("Sorgu gönderiliyor...");

    try {
      const response = await axios.get("/api/serp", {
        params: {
          api_key: process.env.NEXT_PUBLIC_SERP_API_KEY,
          q: keyword,
          num: 100,
          hl: "tr",
          gl: "tr",
        },
      });

      const organic = response.data.organic_results || [];
      const idx = organic.findIndex((r: any) =>
        (r.link as string).includes(
          domain.replace(/^https?:\/\//, "").replace(/\/$/, "")
        )
      );

      setResult({
        keyword,
        position: idx >= 0 ? idx + 1 : null,
        url: idx >= 0 ? organic[idx].link : null,
      });

      console.log("Yanıt geldi:", response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err); // Tüm detaylı log
        console.error("Response:", err.response);
        console.error("Request:", err.request);
        console.error("Message:", err.message);
        setError(`Hata: ${err.message}`);
      } else {
        console.error("Genel hata:", err);
        setError(
          err.response?.data?.error || err.message || "Bir hata oluştu."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("İstek atılan endpoint:", process.env.NEXT_PUBLIC_SERP_ENDPOINT);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="mb-4">SERP Sıralama Kontrolü</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="domain" className="form-label">
                    Domain
                  </label>
                  <input
                    id="domain"
                    type="url"
                    className="form-control"
                    placeholder="https://ornek.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="keyword" className="form-label">
                    Anahtar Kelime
                  </label>
                  <input
                    id="keyword"
                    type="text"
                    className="form-control"
                    placeholder="ör. yazılım mühendisi"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}>
                  {loading ? "Sorgulanıyor..." : "Sorgula"}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-4" role="alert">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-4">
                  <h5>Sonuç:</h5>
                  <table className="table table-bordered mt-2">
                    <thead>
                      <tr>
                        <th>Anahtar Kelime</th>
                        <th>Pozisyon</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{result.keyword}</td>
                        <td>{result.position ?? "Bulunamadı"}</td>
                        <td>
                          {result.url ? (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noreferrer">
                              {result.url}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
