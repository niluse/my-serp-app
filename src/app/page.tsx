"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import RankingChart from "./components/RankingChart";
import "bootstrap/dist/css/bootstrap.min.css";

interface Result {
  keyword: string;
  position: number | null;
  url: string | null;
}

interface ResultItem {
  title: string;
  link: string;
  position: number;
}

export default function Home() {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [allResults, setAllResults] = useState<ResultItem[]>([]);

  const [domainTouched, setDomainTouched] = useState(false);
  const [keywordTouched, setKeywordTouched] = useState(false);

  const handleSearch = async () => {
    setDomainTouched(true);
    setKeywordTouched(true);

    if (!domain || !keyword) return;

    setLoading(true);
    setError("");
    setSuccess("");
    setResult(null);

    try {
      const response = await axios.get("/api/serp", {
        params: {
          api_key: process.env.NEXT_PUBLIC_SERP_API_KEY,
          q: keyword,
          num: 50,
          hl: "tr",
          gl: "tr",
        },
      });

      const organic = response.data.organic_results || [];

      const cleanedDomain = domain
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

      const rankingResults: ResultItem[] = organic.map(
        (item: any, index: number) => ({
          title: item.title || `Sonuç ${index + 1}`,
          link: item.link,
          position: index + 1,
        })
      );

      setAllResults(rankingResults);

      const organicIdx = organic.findIndex((r: any) =>
        (r.link as string).includes(cleanedDomain)
      );

      const organicResult = {
        keyword,
        position: organicIdx >= 0 ? organicIdx + 1 : null,
        url: organicIdx >= 0 ? organic[organicIdx].link : null,
      };

      setResult(organicResult);
      setSuccess("Arama başarıyla yapıldı.");

      const newEntry = {
        date: new Date().toLocaleString(),
        result: organicResult,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("serp_history", JSON.stringify(updatedHistory));
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("serp_history") || "[]");
    setHistory(stored);
  }, []);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mb-4 text-center">🔍 SERP Sıralama Kontrol</h1>

      <div className="card w-100" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Domain</label>
            <input
              type="text"
              className={`form-control ${
                domainTouched && !domain ? "is-invalid" : ""
              }`}
              placeholder="örnek: example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            {domainTouched && !domain && (
              <div className="invalid-feedback">Bu alan gerekli</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Anahtar Kelime</label>
            <input
              type="text"
              className={`form-control ${
                keywordTouched && !keyword ? "is-invalid" : ""
              }`}
              placeholder="örnek: kahve makineleri"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keywordTouched && !keyword && (
              <div className="invalid-feedback">Bu alan gerekli</div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary w-100"
            disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Aranıyor...
              </>
            ) : (
              "Sıralamayı Kontrol Et"
            )}
          </button>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </div>
      </div>

      {result && (
        <div className="mt-4 text-center">
          <h4>Sonuç:</h4>
          {result.position ? (
            <p>
              <strong>{result.keyword}</strong> için <strong>{domain}</strong>{" "}
              <br />
              <span className="text-success">
                Google'da <strong>{result.position}.</strong> sırada!
              </span>
            </p>
          ) : (
            <p className="text-danger">Google ilk 50'de bulunamadı.</p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 w-100" style={{ maxWidth: 700 }}>
          <h5>Geçmiş Aramalar</h5>
          <ul className="list-group">
            {history.map((entry, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{entry.result.keyword}</strong> —{" "}
                  {entry.result.position ? `#${entry.result.position}` : "Yok"}
                </div>
                <small className="text-muted">{entry.date}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {allResults.length > 0 && (
        <div className="mt-5 w-100" style={{ maxWidth: 700 }}>
          <RankingChart results={allResults} highlightDomain={domain} />
        </div>
      )}
    </div>
  );
}
